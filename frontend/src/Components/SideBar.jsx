import { useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Cpu,
  ShoppingBag,
  Briefcase,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  LucideShare2,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Repository", icon: GitBranch },
  { label: "Analyze", icon: BarChart3 },
  { label: "Train", icon: Cpu },
  { label: "Marketplace", icon: ShoppingBag },
  { label: "Portfolio", icon: Briefcase },
  { label: "SharePortfolio", icon: LucideShare2 },
   { label: "Settings", icon: Settings },
  
];

export default function Sidebar({ activeItem, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`sticky top-0 h-screen md:static z-50 flex flex-col justify-between bg-slate-900
          transition-all duration-300 ease-in-out shrink-0
          ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"}`}
      >
       
        <div>
        
          <div className="flex items-center px-4 h-16 border-b border-slate-800">
            {isOpen ? (
              <div className="flex items-center gap-2.5 truncate">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
                  T
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold tracking-wide text-white">TOM</p>
                  <p className="text-[11px] text-slate-400">Developer Portal</p>
                </div>
              </div>
            ) : (
              <span className="hidden md:block h-8 w-8 shrink-0 rounded-lg bg-indigo-600" />
            )}

            
            <button
              onClick={toggleSidebar}
              className="ml-auto text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <nav className="p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
            {NAV_ITEMS.map(({ label, icon: Icon }) => {
              const isActive = activeItem === label;
              return (
                <button
                  key={label}
                  onClick={() => onSelect(label)}
                  title={!isOpen ? label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                    ${isOpen ? "justify-start" : "md:justify-center"}`}
                >
                  <Icon size={18} className="shrink-0" />
                  {isOpen && <span className="truncate">{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}