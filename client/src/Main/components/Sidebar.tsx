// src/components/Sidebar.tsx
import React from "react";
import {
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import { useThemeContext, getBackgroundCss } from "../../context/ThemeContext";

const Sidebar: React.FC = () => {
  const { themeColors } = useThemeContext();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          background: getBackgroundCss(themeColors.sidebar), // ✅ 放這裡才會生效
        },
      }}
    >
      <Toolbar />
      <List>
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Settings", path: "/settings" },
        ].map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton component={NavLink} to={path}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
