import React, { ChangeEvent, useState } from 'react';
import { lastValueFrom } from 'rxjs';
import { css } from '@emotion/css';
import { AppPluginMeta, GrafanaTheme2, PluginConfigPageProps, PluginMeta } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Alert, Badge, Button, Field, FieldSet, Icon, Input, useStyles2 } from '@grafana/ui';
import { AppPluginSettings, AuraHealthResponse } from '../../types';
import { AuraApiClient } from '../../api';

export interface AppConfigProps extends PluginConfigPageProps<AppPluginMeta<AppPluginSettings>> {}

export const AppConfig = ({ plugin }: AppConfigProps) => {
  const s = useStyles2(getStyles);
  const { enabled, pinned, jsonData } = plugin.meta;

  const [apiUrl, setApiUrl] = useState(jsonData?.apiUrl || '');
  const [defaultLookback, setDefaultLookback] = useState(jsonData?.defaultLookback || '5m');
  const [pollIntervalSec, setPollIntervalSec] = useState<number>(jsonData?.pollIntervalSec || 15);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
    health?: AuraHealthResponse;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await AuraApiClient.getHealth(apiUrl || undefined);
      setTestResult({
        ok: true,
        message: `Successfully connected to Mezmo AURA Orchestrator (v${res.data.aura_version || '0.2.17'}). Status: ${res.data.status.toUpperCase()}`,
        latencyMs: res.latencyMs,
        health: res.data,
      });
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: `Connection test failed: ${err.message || 'Unable to reach AURA API endpoint'}. Ensure the AURA container is running.`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updatePlugin(plugin.meta.id, {
        enabled,
        pinned,
        jsonData: {
          apiUrl: apiUrl.trim(),
          defaultLookback: defaultLookback.trim(),
          pollIntervalSec: Number(pollIntervalSec),
        },
      });
      setSaveSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.headerCard}>
        <div className={s.headerTitleRow}>
          <Icon name="cog" className={s.iconBlue} />
          <h2 className={s.headerTitle}>Mezmo AURA SRE Application Settings</h2>
          <Badge text="APP CONFIGURATION" color="blue" />
        </div>
        <p className={s.headerDesc}>
          Configure connection settings, telemetry lookback bounds, and health diagnostics for the Mezmo AURA SRE Grafana Application.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={s.form}>
        <FieldSet label="Connection &amp; Endpoints">
          <Field
            label="AURA Internal API URL (Optional)"
            description="Leave blank to use Grafana's built-in secure plugin proxy to http://aura:8080. If AURA runs on a custom hostname, specify it here (e.g. http://aura:8080 or https://localhost/aura)."
          >
            <Input
              width={60}
              name="apiUrl"
              value={apiUrl}
              placeholder="http://aura:8080 (default: Grafana internal proxy)"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setApiUrl(e.target.value)}
            />
          </Field>

          <Field
            label="Default Telemetry Lookback Window"
            description="Default time range queried across VictoriaMetrics, VictoriaLogs, and VictoriaTraces unless overridden in user prompts."
          >
            <Input
              width={20}
              name="defaultLookback"
              value={defaultLookback}
              placeholder="5m"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDefaultLookback(e.target.value)}
            />
          </Field>

          <Field
            label="Health Telemetry Poll Interval (seconds)"
            description="Frequency in seconds for updating the live health indicator and latency metric."
          >
            <Input
              width={20}
              type="number"
              name="pollIntervalSec"
              value={pollIntervalSec}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPollIntervalSec(Number(e.target.value))}
            />
          </Field>

          <div className={s.buttonRow}>
            <Button
              type="button"
              variant="secondary"
              icon={isTesting ? undefined : 'heart-rate'}
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? 'Testing Connection...' : 'Test Connection'}
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              icon={isSaving ? undefined : 'save'}
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </FieldSet>
      </form>

      {/* Test feedback */}
      {testResult && (
        <div className={s.alertBox}>
          <Alert
            title={testResult.ok ? 'Connection Succeeded' : 'Connection Failed'}
            severity={testResult.ok ? 'success' : 'error'}
          >
            <p>{testResult.message}</p>
            {testResult.latencyMs !== undefined && (
              <p>
                <strong>Roundtrip Latency:</strong> {testResult.latencyMs} ms
              </p>
            )}
          </Alert>
        </div>
      )}

      {saveSuccess && (
        <div className={s.alertBox}>
          <Alert title="Settings Saved" severity="success">
            Configuration successfully saved. Reloading plugin state...
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AppConfig;

const updatePlugin = async (pluginId: string, data: Partial<PluginMeta<AppPluginSettings>>) => {
  const response = await getBackendSrv().fetch({
    url: `/api/plugins/${pluginId}/settings`,
    method: 'POST',
    data,
  });
  return lastValueFrom(response);
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    max-width: 960px;
    padding: ${theme.spacing(2)};
  `,
  headerCard: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
  `,
  headerTitleRow: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin-bottom: ${theme.spacing(0.5)};
  `,
  headerTitle: css`
    font-size: 1.25rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  `,
  iconBlue: css`
    color: #38bdf8;
  `,
  headerDesc: css`
    font-size: 0.875rem;
    color: ${theme.colors.text.secondary};
    margin: 0;
  `,
  form: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2.5)};
  `,
  buttonRow: css`
    display: flex;
    gap: ${theme.spacing(1.5)};
    margin-top: ${theme.spacing(3)};
  `,
  alertBox: css`
    margin-top: ${theme.spacing(1)};
  `,
});
