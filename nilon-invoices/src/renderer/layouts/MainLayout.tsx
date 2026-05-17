import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0D1A] text-white">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar Telemetry Header */}
        <Topbar />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#0F172A] via-[#090D1F] to-[#050712]">
          <div className="mx-auto max-w-7xl h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
