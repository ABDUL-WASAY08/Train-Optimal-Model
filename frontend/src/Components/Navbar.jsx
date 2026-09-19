import React, { useState } from 'react';
import { Share2, Edit3, LogOut, Code2, Menu, X, Cat } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Navbar({ onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

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

  // Dummy actions for now
  const handleDummyShare = () => {
    toast.info("Dummy: Share portfolio feature clicked!");
    if (onSelectTab) onSelectTab("SharePortfolio");
  };

  const handleDummyEdit = () => {
    toast.info("Dummy: Edit portfolio feature clicked!");
    if (onSelectTab) onSelectTab("Settings");
  };

  return (
    <header className="absolute top-0 left-0 z-50 w-full backdrop-blur-md border-b border-[#30363d] bg-[#0d1117]/80">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab?.('Portfolio')}>
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
           <Cat />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            TOM
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleDummyEdit}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={handleDummyShare}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-gray-400" />
            <span>Share Portfolio</span>
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="group flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-[var(--pulse-cyan)] bg-transparent hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 rounded-xl transition-all duration-200 cursor-pointer ml-2"
          >
            <span>Sign Out</span>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-[var(--pulse-cyan)] transition-colors duration-200" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-gray-400 hover:text-white bg-[#21262d] border border-[#30363d] rounded-xl transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1117] border-b border-[#30363d] px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <button
            onClick={() => { setMobileMenuOpen(false); handleDummyEdit(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-200 hover:bg-[#21262d] rounded-xl transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); handleDummyShare(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-200 hover:bg-[#21262d] rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-400" />
            <span>Share Portfolio</span>
          </button>

          <div className="pt-2 border-t border-[#30363d]">
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;