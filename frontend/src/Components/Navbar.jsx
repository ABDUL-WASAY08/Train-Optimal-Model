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
  const handleDummyShare = () => {
    toast.info("you can just copy the url and share it ");
    if (onSelectTab) onSelectTab("SharePortfolio");
  };

  const handleDummyEdit = () => {
    toast.info("here you can edit your portfolio related info");
    if (onSelectTab) onSelectTab("Settings");
  };

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 backdrop-blur border-b border-slate-200 bg-white/90">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab?.('Portfolio')}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Cat size={16} />
          </span>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            TOM
          </span>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleDummyEdit}
            type="button"
            className="btn-secondary btn-sm"
          >
            <Edit3 size={15} className="text-slate-400" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={handleDummyShare}
            type="button"
            className="btn-secondary btn-sm"
          >
            <Share2 size={15} className="text-slate-400" />
            <span>Share Portfolio</span>
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="btn-ghost btn-sm text-slate-500 hover:text-rose-600 ml-1"
          >
            <span>Sign Out</span>
            <LogOut size={15} className="text-slate-400" />
          </button>
        </div>
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="p-2 text-slate-600 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          <button
            onClick={() => { setMobileMenuOpen(false); handleDummyEdit(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); handleDummyShare(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>Share Portfolio</span>
          </button>

          <div className="pt-1 border-t border-slate-200">
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;