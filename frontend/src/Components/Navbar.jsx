import React, { useState } from 'react';
import { Share2, Edit3, LogOut, Code2, Menu, X } from 'lucide-react';

function Navbar({ onOpenEdit, onOpenShare, handleLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            DevPortfolio
          </span>
        </div>

        {/* Desktop Navigation Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Edit Portfolio Button */}
          <button
            onClick={onOpenEdit}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            <span>Edit Portfolio</span>
          </button>

          {/* Share Portfolio Button */}
          <button
            onClick={onOpenShare}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-gray-400" />
            <span>Share Portfolio</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            type="button"
            className="group flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-300 hover:text-[var(--pulse-cyan)] bg-transparent hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 rounded-xl transition-all duration-200 cursor-pointer ml-2"
          >
            <span>Sign Out</span>
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-[var(--pulse-cyan)] transition-colors duration-200" />
          </button>
        </div>

        {/* Mobile Hamburger Menu Button */}
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
            onClick={() => { setMobileMenuOpen(false); onOpenEdit?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-200 hover:bg-[#21262d] rounded-xl transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-400" />
            <span>Edit Portfolio</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenShare?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-200 hover:bg-[#21262d] rounded-xl transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-400" />
            <span>Share Portfolio</span>
          </button>

          <div className="pt-2 border-t border-[#30363d]">
            <button
              onClick={() => { setMobileMenuOpen(false); handleLogout?.(); }}
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