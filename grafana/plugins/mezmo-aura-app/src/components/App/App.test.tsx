import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRootProps, PluginType } from '@grafana/data';
import { render, waitFor } from '@testing-library/react';
import App from './App';

describe('Components/App', () => {
  let props: AppRootProps;

  beforeEach(() => {
    jest.resetAllMocks();

    props = {
      basename: 'a/mezmo-aura-app',
      meta: {
        id: 'mezmo-aura-app',
        name: 'Mezmo AURA SRE',
        type: PluginType.app,
        enabled: true,
        jsonData: {},
      },
      query: {},
      path: '',
      onNavChanged: jest.fn(),
    } as unknown as AppRootProps;
  });

  test('renders without crashing', async () => {
    const { getByText } = render(
      <MemoryRouter>
        <App {...props} />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText(/Mezmo AURA SRE/i)).toBeInTheDocument(), { timeout: 2000 });
  });
});
