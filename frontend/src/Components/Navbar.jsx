import React, { useState, useRef, useEffect } from 'react';
import { Share2, Settings, LogOut, Cat, Menu } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Navbar({ onSelectTab }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleDummyShare = () => {
    setDropdownOpen(false);
    toast.info("You can copy the URL to share your portfolio");
    if (onSelectTab) onSelectTab("SharePortfolio");
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    toast.info("Here you can edit your portfolio related info");
    if (onSelectTab) onSelectTab("Settings");
  };

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end">
        
        {/* USER PROFILE & MENU DROPDOWN CONTAINER */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            className="flex items-center gap-2.5 px-3 py-1.5 bg-white/80 hover:bg-white border border-slate-200/80 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer focus:outline-none"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.name || "User"}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <Cat size={14} />
              </div>
            )}
            <Menu size={16} className="text-slate-600" />
          </button>

          {/* DROPDOWN POPUP MENU */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Developer'}</p>
                <p className="text-[10px] font-medium text-slate-400 truncate">{user?.email || '@handle'}</p>
              </div>

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Settings size={14} className="text-slate-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={handleDummyShare}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Share2 size={14} className="text-indigo-600" />
                <span>Share Portfolio</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              <button
                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;