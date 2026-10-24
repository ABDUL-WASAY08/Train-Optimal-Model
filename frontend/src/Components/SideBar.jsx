import { useState } from "react";
import {
  LayoutDashboard,
  GitBranch,
  Bot,
  Code2,
  Sparkles,
  FileText,
  ShoppingBag,
  Briefcase,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileCode,
  Cat,
  PersonStanding,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Repository", icon: GitBranch },
  { label: "AI Assistant", icon: Bot },
  { label: "CODE ANALYSIS", icon: Code2 },
  { label: "CODE IMPROVEMENT", icon: Sparkles },
  { label: "README GENERATOR", icon: FileCode },
  { label: "DOCUMENTATION", icon: FileText },
  { label: "MARKETPLACE", icon: ShoppingBag },
  { label: "MY BIDS", icon: Briefcase },
  { label: "PROJECTS", icon: FolderKanban },
  { label: "PORTFOLIO", icon: PersonStanding },
  { label: "SETTINGS", icon: Settings },
];

export default function Sidebar({ activeItem, onSelect }) {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Main Container */}
      <aside
        className={`sticky top-0 h-screen md:static z-50 flex flex-col justify-between bg-[#131B2E] text-white border-r border-slate-800/80
          transition-all duration-300 ease-in-out shrink-0
          ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/80 shrink-0">
            {isOpen ? (
              <div className="flex items-center gap-2.5 truncate">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-md shadow-indigo-500/20">
                  <Cat size={18} />
                </span>
                <div className="leading-tight truncate">
                  <p className="text-sm font-black tracking-wider text-white">TOM</p>
                  <p className="text-[10px] font-medium text-indigo-300/80">Developer Portal</p>
                </div>
              </div>
            ) : (
              <span className="hidden md:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-md shadow-indigo-500/20 mx-auto">
                <Cat size={18} />
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className={`text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer ${
                !isOpen ? "mx-auto mt-0" : ""
              }`}
              aria-label="Toggle navigation"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {NAV_ITEMS.map(({ label, icon: Icon }) => {
              const isActive = activeItem?.toUpperCase() === label.toUpperCase();
              return (
                <button
                  key={label}
                  onClick={() => onSelect(label)}
                  title={!isOpen ? label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer
                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500/50"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }
                    ${isOpen ? "justify-start" : "md:justify-center"}`}
                >
                  <Icon size={18} className={`shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`} />
                  {isOpen && <span className="truncate uppercase">{label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}