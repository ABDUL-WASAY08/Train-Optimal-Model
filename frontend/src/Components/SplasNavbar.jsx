import { Cat, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SplashNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/', isRoute: true },
        { name: 'About', path: '/About', isRoute: true },
        { name: 'Features', path: '/Features', isRoute: true },
        { name: 'Architecture', path: '/Architecture', isRoute: true },
        { name: 'Working', path: '#working', isRoute: false },
    ];

    const handleNavClick = (link) => {
        setIsMobileMenuOpen(false);
        if (link.isRoute) {
            navigate(link.path);
        } else {
            if (location.pathname !== '/') {
                navigate(`/${link.path}`);
            } else {
                const element = document.querySelector(link.path);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between md:grid md:grid-cols-3">
                
                {/* Left Column (Brand Logo, Separator & Subtitle) */}
                <div className="flex items-center justify-start gap-2.5 sm:gap-3">
                    <div 
                        className="flex items-center gap-2 cursor-pointer group" 
                        onClick={() => navigate('/')}
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors shrink-0">
                            <Cat className="w-4 h-4" />
                        </span>
                        <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                            TOM
                        </span>
                    </div>

                    <span className="text-slate-300 font-light text-xs sm:text-sm">|</span>

                    <span className="text-slate-400 text-[11px] sm:text-xs font-normal truncate hidden sm:inline">
                        Train Optimal Model
                    </span>
                </div>

                {/* Center Column (Navigation Links for Desktop) */}
                <div className="hidden md:flex items-center justify-center gap-5 lg:gap-6">
                    {navLinks.map((link) => {
                        const isActive = link.isRoute && location.pathname.toLowerCase() === link.path.toLowerCase();
                        return (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className={`text-xs font-medium transition-colors duration-200 cursor-pointer ${
                                    isActive 
                                        ? 'text-indigo-600 font-bold' 
                                        : 'text-slate-600 hover:text-indigo-600'
                                }`}
                            >
                                {link.name}
                            </button>
                        );
                    })}
                </div>

                {/* Right Column (Sign In, Get Started & Mobile Toggle) */}
                <div className="flex items-center justify-end gap-2 sm:gap-2.5">
                    <button
                        onClick={() => navigate('/Authorization')}
                        className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all duration-200 cursor-pointer shadow-2xs"
                    >
                        Sign in
                    </button>

                    <button
                        onClick={() => navigate('/Authorization')}
                        className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all duration-200 cursor-pointer"
                    >
                        Get Started
                    </button>

                    {/* Mobile Menu Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-1.5 text-slate-600 hover:text-indigo-600 focus:outline-none cursor-pointer"
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
                    {navLinks.map((link) => {
                        const isActive = link.isRoute && location.pathname.toLowerCase() === link.path.toLowerCase();
                        return (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link)}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                                    isActive 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                                }`}
                            >
                                {link.name}
                            </button>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}

export default SplashNavbar;