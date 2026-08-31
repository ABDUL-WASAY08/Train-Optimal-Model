import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  GitBranch,
  BarChart3,
  Cpu,
  ShoppingBag,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
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
  const { theme } = useTheme();

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        />
      )}

      <aside
        style={{
          backgroundColor: theme.sidebar,
          borderColor: theme.border,
          width: isOpen ? "256px" : "80px",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0 md:translate-x-0`}
      >
        <div>
          <div
            className="flex items-center justify-between px-4 h-16"
            style={{ borderBottom: `1px solid ${theme.border}` }}
          >
            {isOpen ? (
              <h1 className="text-lg font-bold tracking-wide truncate" style={{ color: theme.text }}>
                TOM
              </h1>
            ) : (
              <span className="hidden md:block w-4" />
            )}
            <button
              onClick={() => setIsOpen((p) => !p)}
              className="p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{ color: theme.subtext }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.hover; e.currentTarget.style.color = theme.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = theme.subtext; }}
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isOpen ? "justify-start" : "md:justify-center"
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.active : "transparent",
                    color: isActive ? theme.activeText : theme.sidebarText,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = theme.hover; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
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
