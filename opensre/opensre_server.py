"""OpenSRE HTTP Server for Grafana App and Webhooks.

Exposes:
- GET /health: Health probe for Grafana and Docker healthcheck
- GET /v1/models: OpenAI-compatible model listing
- POST /v1/chat/completions: OpenAI-compatible chat completions (stateless, legacy)
- POST /: A2A JSON-RPC (message/send, tasks/get) for background investigations
- POST /alerts: Alert intake router from OpenSRE
"""

from __future__ import annotations

import asyncio
import os
import time
import uuid
from datetime import datetime, timezone
from http import HTTPStatus

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, Histogram, generate_latest

from bootstrap.process import WEB_PROFILE, configure_process
from infrastructure.alert_intake import router as alert_router

# Configure OpenSRE web profile
configure_process(WEB_PROFILE)

app = FastAPI(title="OpenSRE AI Agent", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alert_router)

# --- Prometheus metrics ---
REQUEST_COUNT = Counter(
    "opensre_requests_total",
    "Total HTTP requests served by OpenSRE",
    ["method", "path", "status"],
)
REQUEST_DURATION = Histogram(
    "opensre_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "path"],
)
INVESTIGATIONS_TOTAL = Counter(
    "opensre_investigations_total",
    "Total SRE investigations executed",
)
INVESTIGATIONS_IN_FLIGHT = Gauge(
    "opensre_investigations_in_flight",
    "Investigations currently running",
)


@app.middleware("http")
async def metrics_middleware(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    if request.url.path != "/metrics":
        route = request.scope.get("route")
        path = route.path if route is not None else request.url.path
        REQUEST_COUNT.labels(
            method=request.method, path=path, status=str(response.status_code)
        ).inc()
        REQUEST_DURATION.labels(method=request.method, path=path).observe(
            time.perf_counter() - start
        )
    return response


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def _active_model() -> str:
    return (
        os.environ.get("CUSTOM_OPENAI_MODEL")
        or os.environ.get("AURA_MODEL")
        or "aura-sre-model"
    )


def _run_turn_sync(prompt: str) -> str:
    """Run one headless agent turn and return its best response text.

    Errors from the agent are returned as text (the existing behaviour), not
    raised — a failed turn surfaces as a plain message, never a 500.
    """
    from core.agent_harness import AgentSession

    try:
        result = AgentSession.run_headless_turn(prompt)
        if result.answered:
            return result.primary_response_text
        if result.assistant_response_text:
            return result.assistant_response_text
        return "Investigation concluded with no additional findings."
    except Exception as err:  # noqa: BLE001 - surface as text, don't crash the task
        return f"OpenSRE Investigation encountered an error: {err}"


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    messages: list[ChatMessage]
    model: str | None = None
    stream: bool = False


@app.get("/")
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "opensre",
        "version": "0.1.0",
        "llm_provider": os.environ.get("LLM_PROVIDER", "custom-openai"),
        "model": _active_model(),
        "base_url": os.environ.get("CUSTOM_OPENAI_BASE_URL", "http://litellm:4000/v1"),
    }


@app.get("/v1/models")
def get_models():
    return {
        "object": "list",
        "data": [
            {
                "id": _active_model(),
                "object": "model",
                "created": int(time.time()),
                "owned_by": "opensre",
            }
        ],
    }


@app.post("/v1/chat/completions")
async def chat_completions(req: ChatCompletionRequest):
    user_prompts = [m.content for m in req.messages if m.role == "user"]
    if not user_prompts:
        return JSONResponse(
            status_code=400,
            content={"error": {"message": "No user message found in prompt."}},
        )

    last_prompt = user_prompts[-1]
    active_model = req.model or _active_model()

    loop = asyncio.get_running_loop()
    INVESTIGATIONS_IN_FLIGHT.inc()
    try:
        response_text = await loop.run_in_executor(None, _run_turn_sync, last_prompt)
    finally:
        INVESTIGATIONS_IN_FLIGHT.dec()
    INVESTIGATIONS_TOTAL.inc()

    return {
        "id": f"chatcmpl-opensre-{int(time.time())}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": active_model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": response_text,
                },
                "finish_reason": "stop",
            }
        ],
    }


# ── A2A (Agent-to-Agent) JSON-RPC — background investigations ──────────────
# Mirrors mezmo/aura's legacy binding (served at `/`): `message/send` returns
# immediately with a `working` task, and `tasks/get` reports its progress. The
# investigation runs server-side with no client attached, so it survives
# Grafana navigation and is polled to completion by the console.

_TASKS: dict[str, dict] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class JsonRpcRequest(BaseModel):
    jsonrpc: str = "2.0"
    id: str | int = ""
    method: str
    params: dict = Field(default_factory=dict)


def _rpc_result(req_id, result):
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def _rpc_error(req_id, code, message):
    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}


def _text_parts(parts) -> str:
    return " ".join(p.get("text", "") for p in parts if p.get("kind") == "text")


async def _run_task(task_id: str, prompt: str) -> None:
    """Execute the investigation and record its terminal state in ``_TASKS``."""
    loop = asyncio.get_running_loop()
    INVESTIGATIONS_IN_FLIGHT.inc()
    try:
        text = await loop.run_in_executor(None, _run_turn_sync, prompt)
        task = _TASKS.get(task_id)
        if task:
            task["status"] = {"state": "completed", "timestamp": _now_iso()}
            task["artifacts"] = [
                {
                    "artifactId": "response",
                    "name": "Response",
                    "parts": [{"kind": "text", "text": text}],
                },
                {
                    "artifactId": "final",
                    "name": "Final Info",
                    "parts": [{"kind": "text", "text": text}],
                },
            ]
    except Exception as err:  # noqa: BLE001 - never leave a task stuck in "working"
        task = _TASKS.get(task_id)
        if task:
            task["status"] = {
                "state": "failed",
                "timestamp": _now_iso(),
                "message": {
                    "kind": "message",
                    "messageId": "",
                    "role": "agent",
                    "parts": [{"kind": "text", "text": f"Investigation error: {err}"}],
                },
            }
    finally:
        INVESTIGATIONS_IN_FLIGHT.dec()
    INVESTIGATIONS_TOTAL.inc()


@app.post("/")
async def a2a_rpc(req: JsonRpcRequest):
    if req.method == "message/send":
        message = req.params.get("message", {})
        prompt = _text_parts(message.get("parts", []))
        context_id = message.get("contextId") or str(uuid.uuid4())
        task_id = str(uuid.uuid4())
        now = _now_iso()
        history = [
            {
                "kind": "message",
                "messageId": message.get("messageId", ""),
                "role": message.get("role", "user"),
                "parts": message.get("parts", []),
            }
        ]
        _TASKS[task_id] = {
            "kind": "task",
            "id": task_id,
            "contextId": context_id,
            "status": {"state": "working", "timestamp": now},
            "history": history,
            "artifacts": [],
        }
        asyncio.create_task(_run_task(task_id, prompt))
        return _rpc_result(
            req.id,
            {
                "contextId": context_id,
                "history": history,
                "id": task_id,
                "kind": "task",
                "status": {"state": "working", "timestamp": now},
            },
        )

    if req.method == "tasks/get":
        task_id = req.params.get("id", "")
        task = _TASKS.get(task_id)
        if not task:
            return _rpc_error(req.id, -32001, f"task not found: {task_id}")
        return _rpc_result(req.id, task)

    return _rpc_error(req.id, -32601, f"method not found: {req.method}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
