import { getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';
import { A2aJsonRpcResponse, A2aTask, AuraHealthResponse, AuraModel } from './types';
import { PLUGIN_ID } from './constants';

export class AuraApiClient {
  private static getProxyUrl(subpath: string, customUrl?: string): string {
    if (customUrl && customUrl.trim()) {
      return `${customUrl.trim().replace(/\/$/, '')}/${subpath.replace(/^\//, '')}`;
    }
    return `api/plugin-proxy/${PLUGIN_ID}/aura/${subpath.replace(/^\//, '')}`;
  }

  static async getHealth(customUrl?: string): Promise<{ data: AuraHealthResponse; latencyMs: number }> {
    const start = performance.now();
    const url = this.getProxyUrl('health', customUrl);

    try {
      const response = await lastValueFrom(
        getBackendSrv().fetch<AuraHealthResponse>({
          url,
          method: 'GET',
        })
      );
      const latencyMs = Math.round(performance.now() - start);
      return { data: response.data, latencyMs };
    } catch (err: any) {
      // Fallback direct request in case plugin-proxy isn't initialized yet
      try {
        const fallbackRes = await fetch('/aura/health');
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const latencyMs = Math.round(performance.now() - start);
          return { data, latencyMs };
        }
      } catch {
        // ignore fallback failure
      }
      throw err;
    }
  }

  static async getModels(customUrl?: string): Promise<AuraModel[]> {
    const url = this.getProxyUrl('v1/models', customUrl);
    try {
      const response = await lastValueFrom(
        getBackendSrv().fetch<{ data: AuraModel[] }>({
          url,
          method: 'GET',
        })
      );
      return response.data?.data || [];
    } catch {
      try {
        const directRes = await fetch('/aura/v1/models');
        if (directRes.ok) {
          const json = await directRes.json();
          return json.data || [];
        }
      } catch {
        // ignore
      }
      return [];
    }
  }

  static async sendChat(
    messages: Array<{ role: string; content: string }>,
    customUrl?: string
  ): Promise<string> {
    const url = this.getProxyUrl('v1/chat/completions', customUrl);

    try {
      const response = await lastValueFrom(
        getBackendSrv().fetch<{ choices?: Array<{ message?: { content?: string } }> }>({
          url,
          method: 'POST',
          data: {
            messages,
          },
        })
      );

      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from Mezmo AURA Orchestrator');
      }
      return content;
    } catch (err: any) {
      // Direct browser fallback
      try {
        const directRes = await fetch('/aura/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        });
        if (directRes.ok) {
          const json = await directRes.json();
          const reply = json.choices?.[0]?.message?.content;
          if (reply) {return reply;}
        }
      } catch {
        // ignore fallback
      }

      const errMsg =
        err?.data?.message ||
        err?.data?.error?.message ||
        err?.statusText ||
        err?.message ||
        'Error communicating with AURA Orchestrator';
      throw new Error(errMsg);
    }
  }

  /**
   * Issue a JSON-RPC call to AURA's legacy A2A binding (served at the server
   * root `/`), returning the parsed `result` payload or throwing on `error`.
   */
  private static async a2aJsonRpc<T>(method: string, params: unknown): Promise<T> {
    const url = this.getProxyUrl('', undefined);
    const response = await lastValueFrom(
      getBackendSrv().fetch<A2aJsonRpcResponse<T>>({
        url,
        method: 'POST',
        data: {
          jsonrpc: '2.0',
          id: `${method.replace('/', '-')}-${Date.now()}`,
          method,
          params,
        },
      })
    );

    const payload = response.data;
    if (payload?.error) {
      throw new Error(payload.error.message || `A2A ${method} failed`);
    }
    if (!payload?.result) {
      throw new Error(`A2A ${method} returned no result`);
    }
    return payload.result;
  }

  /**
   * Submit a user message to AURA as an A2A task. The server forces
   * `returnImmediately`, so this resolves quickly with a task in `working`
   * state; the investigation continues server-side and is polled via
   * `getA2aTask`. Passing `contextId` continues an existing conversation.
   */
  static async sendA2aMessage(opts: {
    messageId: string;
    text: string;
    contextId?: string | null;
  }): Promise<A2aTask> {
    return this.a2aJsonRpc<A2aTask>('message/send', {
      message: {
        messageId: opts.messageId,
        role: 'user',
        parts: [{ kind: 'text', text: opts.text }],
        ...(opts.contextId ? { contextId: opts.contextId } : {}),
      },
      configuration: {
        acceptedOutputModes: ['text/plain'],
      },
    });
  }

  /** Fetch an A2A task by id to check its completion status and result. */
  static async getA2aTask(taskId: string): Promise<A2aTask> {
    return this.a2aJsonRpc<A2aTask>('tasks/get', { id: taskId });
  }
}
