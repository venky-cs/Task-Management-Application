import { createTheme } from "@mui/material/styles";

const common = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
};

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#1976d2" },
          secondary: { main: "#9c27b0" },
          background: { default: "#f6f7fb", paper: "#fff" },
          text: { primary: "#0f1724", secondary: "#475569" },
        }
      : {
          primary: { main: "#1976d2" },
          secondary: { main: "#9c27b0" },
          background: { default: "#0b1220", paper: "#0f1724" },
          text: { primary: "#e6eef8", secondary: "#9fb3c8" },
        }),
  },
  ...common,
});

export function createAppTheme(mode = "light") {
  return createTheme(getDesignTokens(mode));
}
