import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LogOut, Share, Share2 } from 'lucide-react';
import { useUtilityStore } from '../zustand/useUtilityStore';
import SharePortfolio from './SharePortfolio';

function MainScreen() {
  const [activeItem, setActiveItem] = useState('Portfolio');
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { getPortfolioUrl } = useUtilityStore();
  const [url, setURl] = useState("");
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowUrl(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShare = async () => {
    const response = await getPortfolioUrl();
    if (response.success) {
      await navigator.clipboard.writeText(response.url);
      toast.success("URL copied successfully");
      setURl(response.url);
      setShowUrl(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowUrl(false);
      }, 5000);
    } else {
      toast.error(response.error || "Sorry, we have a problem");
    }
  };

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
        return (
          <div className='relative'>
            {/* Popup Card Aligned to the Right */}
            {showUrl && (
              <div className='absolute right-5 top-8 z-50 flex flex-col gap-1.5 bg-gray-900/95 backdrop-blur-md border border-blue-500/30 p-3 rounded-xl shadow-2xl w-[85vw] max-w-[260px] sm:max-w-xs animate-fadeIn'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold text-gray-200 tracking-wide'>
                    Portfolio URL Generated
                  </span>
                  <span className='text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded'>
                    Copied
                  </span>
                </div>
                <p className='text-[11px] text-gray-400 leading-relaxed'>
                  Your link is ready to share with others.
                </p>
                <div className='mt-1 bg-gray-950/80 border border-gray-800 rounded-lg px-2.5 py-1.5'>
                  <span className='text-xs text-blue-300 font-mono break-all select-all'>
                    {url}
                  </span>
                </div>
              </div>
            )}
            <div ref={containerRef} className='relative'>
              <div
                className='flex items-center justify-end gap-2 mx-[8em] mt-[-32px] cursor-pointer group'
                onClick={handleShare}
              >
                <button className='flex items-center gap-2 text-gray-100 group-hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer'>
                  <Share2 className='w-4 h-4 shrink-0 text-gray-400 group-hover:text-blue-300' />
                  <span>Share</span>
                </button>
                <span className='text-gray-400 text-xs tracking-wide hidden sm:inline pointer-events-none group-hover:text-white transition-colors duration-200'>
                  Click to copy the URL
                </span>
              </div>
            </div>

            <Accounts />
          </div>
        );
      case 'Settings':
        return <Setting />;
      case "SharePortfolio":
        return <SharePortfolio />;
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
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden relative">
      {/* Background Animated Grid & Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(#8b949e_1px,transparent_1px),linear-gradient(90deg,#8b949e_1px,transparent_1px)] bg-[size:45px_45px] animate-[gridMove_18s_linear_infinite]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-full bg-[#238636] opacity-[0.06] blur-[120px] animate-[slowPulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-[35%] -right-40 w-[350px] h-[350px] rounded-full bg-[#58a6ff] opacity-[0.035] blur-[120px] animate-[floatGlow_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-[10%] -left-40 w-[350px] h-[350px] rounded-full bg-[#8957e5] opacity-[0.025] blur-[120px] animate-[floatGlow_11s_ease-in-out_infinite_reverse]" />
      </div>

      <Sidebar
        activeItem={activeItem}
        onSelect={(selectedLabel) => setActiveItem(selectedLabel)}
      />
      <main className="flex-1 overflow-y-auto min-w-0 pt-5 relative z-10">
        <div className="flex justify-end px-6 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className='group text-sm font-medium flex items-center gap-2 cursor-pointer text-gray-300 hover:text-[var(--pulse-cyan)] transition-colors duration-200 focus:outline-none z-20'
          >
            <span>SIGN OUT</span>
            <LogOut className='w-4 h-4 text-gray-400 group-hover:text-[var(--pulse-cyan)] transition-colors duration-200' />
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;