import { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppThemeContext } from "../contexts/ThemeContext";
import { AuthContext } from "../contexts/AuthContext";

export default function TopBar() {
  const { mode, toggleMode } = useContext(AppThemeContext);
  const { user, signOut } = useContext(AuthContext);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 3 }}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Task Management
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user && (
            <Typography
              variant="body2"
              sx={{ mr: 1, display: { xs: "none", sm: "block" } }}
            >
              {user.name || user.email}
            </Typography>
          )}

          <Tooltip
            title={
              mode === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <IconButton onClick={toggleMode} color="inherit" size="large">
              {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>

          {user && (
            <Tooltip title="Sign Out">
              <IconButton onClick={signOut} color="inherit" size="large">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
