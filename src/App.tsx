import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EnergyLogPage from './pages/EnergyLogPage';
import PipelineBoard from './pages/PipelineBoard';
import ParkingLot from './pages/ParkingLot';
import InfoFirewall from './pages/InfoFirewall';
import Strategy from './pages/Strategy';
import ReflectionPage from './pages/ReflectionPage';

export type Page = 'dashboard' | 'energy' | 'info' | 'strategy' | 'pipeline' | 'reflection' | 'parking';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <StoreProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'energy' && <EnergyLogPage />}
        {currentPage === 'info' && <InfoFirewall />}
        {currentPage === 'strategy' && <Strategy />}
        {currentPage === 'pipeline' && <PipelineBoard />}
        {currentPage === 'reflection' && <ReflectionPage />}
        {currentPage === 'parking' && <ParkingLot />}
      </Layout>
    </StoreProvider>
  );
}
