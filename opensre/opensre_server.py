"""OpenSRE HTTP Server for Grafana App and Webhooks.

Exposes:
- GET /health: Health probe for Grafana and Docker healthcheck
- GET /v1/models: OpenAI-compatible model listing
- POST /v1/chat/completions: OpenAI-compatible chat completions for Grafana opensre-app
- POST /alerts: Alert intake router from OpenSRE
"""

from __future__ import annotations

import asyncio
import os
import time
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
    active_model = os.environ.get("CUSTOM_OPENAI_MODEL") or os.environ.get("AURA_MODEL") or "aura-sre-model"
    return {
        "status": "healthy",
        "service": "opensre",
        "version": "0.1.0",
        "llm_provider": os.environ.get("LLM_PROVIDER", "custom-openai"),
        "model": active_model,
        "base_url": os.environ.get("CUSTOM_OPENAI_BASE_URL", "http://litellm:4000/v1"),
    }


@app.get("/v1/models")
def get_models():
    active_model = os.environ.get("CUSTOM_OPENAI_MODEL") or os.environ.get("AURA_MODEL") or "aura-sre-model"
    return {
        "object": "list",
        "data": [
            {
                "id": active_model,
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
    active_model = req.model or os.environ.get("CUSTOM_OPENAI_MODEL") or os.environ.get("AURA_MODEL") or "aura-sre-model"

    from core.agent_harness import AgentSession

    def run_turn():
        try:
            result = AgentSession.run_headless_turn(last_prompt)
            if result.answered:
                return result.primary_response_text
            elif result.assistant_response_text:
                return result.assistant_response_text
            else:
                return "Investigation concluded with no additional findings."
        except Exception as err:
            return f"OpenSRE Investigation encountered an error: {err}"

    loop = asyncio.get_running_loop()
    INVESTIGATIONS_IN_FLIGHT.inc()
    try:
        response_text = await loop.run_in_executor(None, run_turn)
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
