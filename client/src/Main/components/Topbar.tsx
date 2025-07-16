// src/components/Topbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

import { useThemeContext, getBackgroundCss } from "../../context/ThemeContext";

const Topbar: React.FC = () => {
  const { themeColors } = useThemeContext();

  const handleSettingsClick = () => {
    window.open("/settings", "_blank", "noopener,noreferrer");
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1, 
      background: getBackgroundCss(themeColors.topbar),
      color: getBackgroundCss(themeColors.text),
       }} >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography style={{ color: getBackgroundCss(themeColors.title)}} variant="h6" noWrap>
          My App
        </Typography>
        <IconButton color="inherit" onClick={handleSettingsClick}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
