import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);
const STORAGE_KEY = "tom-theme";

const darkTheme = {
  bg: "#0d1117",
  card: "#161b22",
  text: "#ffffff",
  subtext: "#8b949e",
  accent: "#3ecfff",
  border: "#2a3441",
  input: "#0d1117",
  inputText: "#c9d1d9",
  hover: "#1c2128",
  sidebar: "#161b22",
  sidebarText: "rgba(255,255,255,0.7)",
  active: "rgba(255,255,255,0.2)",
  activeText: "#ffffff",
  button: "#161b22",
  buttonText: "#c9d1d9",
  error: "#f85149",
  success: "#3fb950",
  accentViolet: "#8b5cf6",
  skeletonBase: "#1c2128",
  skeletonMid: "#2d333b",
  glowCyan: "rgba(62, 207, 255, 0.1)",
  glowViolet: "rgba(139, 92, 246, 0.1)",
  glowPurple: "rgba(168, 85, 247, 0.1)",
};

const lightTheme = {
  bg: "#f6f8fa",
  card: "#ffffff",
  text: "#1f2328",
  subtext: "#656d76",
  accent: "#0969da",
  border: "#d0d7de",
  input: "#f6f8fa",
  inputText: "#3d4752",
  hover: "#f3f4f6",
  sidebar: "#ffffff",
  sidebarText: "#3d4752",
  active: "#e8f0fe",
  activeText: "#0969da",
  button: "#f6f8fa",
  buttonText: "#3d4752",
  error: "#d1242f",
  success: "#1a7f37",
  accentViolet: "#8250df",
  skeletonBase: "#e8ecf0",
  skeletonMid: "#d0d7de",
  glowCyan: "rgba(9, 105, 218, 0.06)",
  glowViolet: "rgba(130, 80, 223, 0.06)",
  glowPurple: "rgba(168, 85, 247, 0.06)",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? saved === "dark" : true;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
