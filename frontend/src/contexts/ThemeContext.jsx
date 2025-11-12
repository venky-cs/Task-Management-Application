import { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "../theme/theme";

export const AppThemeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export default function AppThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem("theme_mode");
      return stored === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("theme_mode", mode);
    } catch {}
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === "light" ? "dark" : "light"));

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <AppThemeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppThemeContext.Provider>
  );
}
