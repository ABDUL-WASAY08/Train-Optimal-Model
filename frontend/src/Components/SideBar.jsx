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
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Repository", icon: GitBranch },
  { label: "Analyze", icon: BarChart3 },
  { label: "Train", icon: Cpu },
  { label: "Marketplace", icon: ShoppingBag },
  { label: "Portfolio", icon: Briefcase },
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
        style={{ backgroundColor: "var(--side-bar, #1e1e2e)" }}
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between
          transition-all duration-300 ease-in-out shrink-0
          ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"}`}
      >
       
        <div>
        
          <div className="flex items-center justify-between px-4 h-16  border-white/10">
            {isOpen ? (
              <h1 className="text-lg font-bold text-white tracking-wide truncate">
                TOM
              </h1>
            ) : (
              <span className="hidden md:block w-4" />
            )}

            
            <button
              onClick={toggleSidebar}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <nav className="p-3 space-y-1.5">
            {NAV_ITEMS.map(({ label, icon: Icon }) => {
              const isActive = activeItem === label;
              return (
                <button
                  key={label}
                  onClick={() => onSelect(label)}
                  title={!isOpen ? label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                    ${isOpen ? "justify-start" : "md:justify-center"}`}
                >
                  <Icon size={20} className="shrink-0" />
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