import { getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';
import { AuraHealthResponse, AuraModel } from './types';
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
}
