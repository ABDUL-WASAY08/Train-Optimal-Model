import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Share, Share2 } from 'lucide-react';
import { useUtilityStore } from '../zustand/useUtilityStore';

function MainScreen() {
  const [activeItem, setActiveItem] = useState('Portfolio');
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { getPortfolioUrl } = useUtilityStore();
  const renderContent = () => {
    const handleShare = async () => {
      const response = await getPortfolioUrl();
      if (response.success) {
        await navigator.clipboard.writeText(response.url);
        toast.success("URL copied successfully");

      } else {
        toast.error(response.error || "Sorry, we have a problem");
      }
    };
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
        return (
          <div className=''>
            <div
              className='flex items-center justify-end gap-2 mx-[8em] mt-[-22px] cursor-pointer group'
              onClick={() => handleShare()}
            >
              <button className='flex items-center gap-2 text-gray-100 group-hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer'>
                <Share2 className='w-4 h-4 shrink-0 text-gray-400 group-hover:text-blue-300' />
                <span>Share</span>
              </button>
              <span className='text-gray-400 text-xs tracking-wide hidden sm:inline pointer-events-none group-hover:text-white transition-colors duration-200'>
                Click to share
              </span>
            </div>
            <Accounts />
          </div>
        );
      case 'Settings':
        return <Setting />;
      default:
        return <Accounts />;
    }
  };


  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res?.success) {
        toast.success("Logout successful");
        navigate('/Authorization');
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during sign out");
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden">
      <Sidebar
        activeItem={activeItem}
        onSelect={(selectedLabel) => setActiveItem(selectedLabel)}
      />
      <main className="flex-1 overflow-y-auto min-w-0">
        <p
          className='hover:text-[var(--pulse-cyan)] transition-colors duration-200 flex justify-end px-6 pt-5 cursor-pointer'
          onClick={handleLogout}
        >
          SIGN OUT
        </p>
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;