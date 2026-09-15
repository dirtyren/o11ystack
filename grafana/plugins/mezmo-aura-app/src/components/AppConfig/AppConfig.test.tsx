import React from 'react';
import { render, screen } from '@testing-library/react';
import { PluginType } from '@grafana/data';
import AppConfig, { AppConfigProps } from './AppConfig';
import { testIds } from 'components/testIds';

describe('Components/AppConfig', () => {
  let props: AppConfigProps;

  beforeEach(() => {
    jest.resetAllMocks();

    props = {
      plugin: {
        meta: {
          id: 'sample-app',
          name: 'Sample App',
          type: PluginType.app,
          enabled: true,
          jsonData: {},
        },
      },
      query: {},
    } as unknown as AppConfigProps;
  });

  test('renders Mezmo AURA SRE configuration fields and action buttons', () => {
    const plugin = { meta: { ...props.plugin.meta, enabled: true } };

    // @ts-ignore
    render(<AppConfig plugin={plugin} query={props.query} />);

    expect(screen.getByText(/Mezmo AURA SRE Application Settings/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save configuration/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /test connection/i })).toBeInTheDocument();
  });
});
