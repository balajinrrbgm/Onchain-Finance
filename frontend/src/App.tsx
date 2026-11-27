import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import AssetOnboardingPage from './pages/AssetOnboardingPage';
import LoanDeskPage from './pages/LoanDeskPage';
import RemittancePage from './pages/RemittancePage';
import { Layout } from './components/Layout';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/assets" element={<AssetOnboardingPage />} />
      <Route path="/loans" element={<LoanDeskPage />} />
      <Route path="/remittance" element={<RemittancePage />} />
    </Routes>
  </Layout>
);

export default App;
