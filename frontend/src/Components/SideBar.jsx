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

function SideBar() {
  const [isOpen, setIsOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const handleNavClick = (label) => {
    console.log(`Nav button clicked: ${label}`);
    setActive(label);
  };

  const handleToggle = () => {
    console.log("Sidebar toggle clicked");
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full bg-main overflow-hidden">
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ backgroundColor: "var(--side-bar)" }}
        className={`fixed z-30 inset-y-0 left-0 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:translate-x-0 md:w-20"}
          md:static md:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-black/10">
          {isOpen ? (
            <h1 className="text-lg font-bold text-white tracking-wide truncate">
              MyApp
            </h1>
          ) : (
            <span className="hidden md:block w-6" />
          )}
          <button
            onClick={handleToggle}
            className="text-white/90 hover:text-white p-1 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const isActive = active === label;
            return (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive
                    ? "bg-white/20 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"}
                  ${isOpen ? "justify-start" : "md:justify-center"}`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`${isOpen ? "inline" : "hidden md:hidden"} truncate`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-black/10">
          <p className={`text-xs text-white/70 ${isOpen ? "block" : "hidden md:hidden"}`}>
            v1.0.0
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (mobile toggle trigger) */}
        <header className="h-16 flex items-center gap-3 px-4 bg-surface border-b border-black/10 md:hidden">
          <button
            onClick={handleToggle}
            className="text-heading p-1 rounded-md hover:bg-black/10"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <h2 className="text-heading font-semibold">{active}</h2>
        </header>

        {/* Dummy content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold text-heading mb-2">{active}</h1>
          <p className="text-subheading mb-6">
            This is a placeholder screen for the {active} section.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="bg-surface rounded-xl p-5 shadow-sm"
              >
                <h3 className="text-heading font-semibold mb-1">
                  Placeholder Card {card}
                </h3>
                <p className="text-body-custom text-sm">
                  Dummy content block. No real data or logic here.
                </p>
                <button
                  onClick={() => console.log(`Card ${card} action clicked`)}
                  className="btn-custom mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Action
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
export default SideBar