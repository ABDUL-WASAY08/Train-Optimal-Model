import React, { useState } from 'react';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import SharePortfolio from './SharePortfolio';
import Navbar from '../Components/Navbar';

function MainScreen() {
  const [activeItem, setActiveItem] = useState('Portfolio');

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
        return <Setting />;
      case "SharePortfolio":
        return <SharePortfolio />;
      default:
        return <Accounts />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden relative">
      {/* Background Animated Grid & Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(#8b949e_1px,transparent_1px),linear-gradient(90deg,#8b949e_1px,transparent_1px)] bg-[size:45px_45px] animate-[gridMove_18s_linear_infinite]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-full bg-[#238636] opacity-[0.06] blur-[120px] animate-[slowPulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-[35%] -right-40 w-[350px] h-[350px] rounded-full bg-[#58a6ff] opacity-[0.035] blur-[120px] animate-[floatGlow_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] -left-40 w-[350px] h-[350px] rounded-full bg-[#8957e5] opacity-[0.025] blur-[120px] animate-[floatGlow_11s_ease-in-out_infinite_reverse]" />
      </div>

      <Navbar onSelectTab={(tab) => setActiveItem(tab)} />
      
      <Sidebar
        activeItem={activeItem}
        onSelect={(selectedLabel) => setActiveItem(selectedLabel)}
      />
      <main className="flex-1 mt-20 overflow-y-auto min-w-0 pt-5 relative z-10">
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;