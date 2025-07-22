// src/components/Topbar.tsx
import React, {useState} from "react";
import { Box, AppBar, Avatar, Toolbar, Typography, IconButton, MenuItem, ListItemIcon } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import UserProfileDialog from './UserProfileDialog';
import photo from '../../../image/15644664-fe18-4f90-9a6d-7286ee87ebe8.15644664-fe17-4af9-86a8-90c6e7b27621.jpeg';

import { useThemeContext, getColorCss } from "../../../context/ThemeContext";

const Topbar: React.FC = () => {
  const { themeColors } = useThemeContext();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSettingsClick = () => {
    window.open("/settings", "_blank", "noopener,noreferrer");
  };

  const handleProfileClick = () => {
    setProfileOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login"; // 或用 navigate()
  };

  return (
    <>
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        background: getColorCss(themeColors.topbar),
        color: getColorCss(themeColors.text),
        }} >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography style={{ color: getColorCss(themeColors.title)}} variant="h6" noWrap>
            Web framework
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton color="inherit" onClick={handleSettingsClick}>
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                src={photo}
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
            <MenuItem
              onClick={handleLogout}
              sx={{ minWidth: 'auto', px: 1, justifyContent: 'flex-end' }}  // 減少 padding 並靠右
            >
              <ListItemIcon sx={{ minWidth: 0, pl: 1 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
          </Box>
        </Toolbar>
      </AppBar>
      <UserProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>

  );
};

export default Topbar;
