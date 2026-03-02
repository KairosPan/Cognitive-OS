import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EnergyLogPage from './pages/EnergyLogPage';
import PipelineBoard from './pages/PipelineBoard';
import TaskEngine from './pages/TaskEngine';
import ParkingLot from './pages/ParkingLot';

export type Page = 'dashboard' | 'energy' | 'pipeline' | 'tasks' | 'parking';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  return (
    <StoreProvider>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'energy' && <EnergyLogPage />}
        {currentPage === 'pipeline' && <PipelineBoard />}
        {currentPage === 'tasks' && <TaskEngine />}
        {currentPage === 'parking' && <ParkingLot />}
      </Layout>
    </StoreProvider>
  );
}
