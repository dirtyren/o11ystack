import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { LoadingPlaceholder } from '@grafana/ui';
import { ROUTES } from '../../constants';

const InvestigationConsole = React.lazy(() => import('../../pages/InvestigationConsole'));
const InvestigationTraces = React.lazy(() => import('../../pages/InvestigationTraces'));
const McpSpecialists = React.lazy(() => import('../../pages/McpSpecialists'));

function App(props: AppRootProps) {
  return (
    <Suspense fallback={<LoadingPlaceholder text="Loading Mezmo AURA SRE..." />}>
      <Routes>
        <Route path={ROUTES.Console} element={<InvestigationConsole />} />
        <Route path={ROUTES.Traces} element={<InvestigationTraces />} />
        <Route path={ROUTES.Integrations} element={<McpSpecialists />} />
        <Route path="*" element={<InvestigationConsole />} />
      </Routes>
    </Suspense>
  );
}

export default App;
