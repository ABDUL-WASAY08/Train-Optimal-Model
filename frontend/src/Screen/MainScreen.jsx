import React, { useState } from 'react';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts'; // Apni Accounts file ka sahi path check kar lein

function MainScreen() {
  // 1. Sidebar selection ki state manage karein (Default: 'Dashboard' ya 'Accounts')
  const [activeItem, setActiveItem] = useState('Portfolio');

  // 2. Clicked item ke according screen render karne ka logic
  const renderContent = () => {
    switch (activeItem) {
      case 'Accounts':
        return <Accounts />;
      case 'Dashboard':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-[#8b949e]">Welcome to your main dashboard view.</p>
          </div>
        );
      case 'Repository':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Repositories</h1>
            <p className="text-[#8b949e]">Your synced code repositories.</p>
          </div>
        );
      case 'Analyze':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Analysis</h1>
            <p className="text-[#8b949e]">ML and code performance insights.</p>
          </div>
        );
      case 'Train':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Train Model</h1>
            <p className="text-[#8b949e]">Configure and start model training.</p>
          </div>
        );
      case 'Marketplace':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
            <p className="text-[#8b949e]">Browse developer tools and models.</p>
          </div>
        );
      case 'Portfolio':
        return <Accounts />;
      case 'Settings':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-[#8b949e]">App preferences and configurations.</p>
          </div>
        );
      default:
        return <Accounts />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden">
      {/* 3. Props pass karein taake state update ho sakay */}
      <Sidebar 
        activeItem={activeItem} 
        onSelect={(selectedLabel) => setActiveItem(selectedLabel)} 
      />

      {/* 4. Scrollable Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;