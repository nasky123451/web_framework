// src/components/Topbar.tsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/setting");  // 導到 /setting 頁面
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap>
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
