import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Drawer,
  List,
  IconButton,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useThemeContext, getBackgroundCss } from "../../../context/ThemeContext";
import { useSidebar } from '../../../context/SidebarContext';


import { menuItems } from "./Menu";
import MenuItemComponent from "./MenuItemComponent";

import { styled } from "@mui/material/styles";

const Sidebar: React.FC = () => {
  const { themeColors } = useThemeContext();
  const { collapsed, toggleCollapsed, getSidebarWidth } = useSidebar();
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const drawerWidth = getSidebarWidth();

  const handleToggleOpen = (label: string) => {
    setOpenKeys((prev) => {
      const newSet = new Set(prev);
      newSet.has(label) ? newSet.delete(label) : newSet.add(label);
      return newSet;
    });
  };

  const HeaderBox = styled("div", {
    shouldForwardProp: (prop) => prop !== "collapsed",
  })<{ collapsed: boolean }>(({ collapsed, theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    paddingLeft: collapsed ? 0 : theme.spacing(2),
    paddingRight: collapsed ? 0 : theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }));

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    flexShrink: 0,
    height: '100vh',
    zIndex: 1200,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      background: getBackgroundCss(themeColors.sidebar),
      color: getBackgroundCss(themeColors.text),
      position: 'relative',
      transition: 'width 0.3s ease',
    },
  };

  const footer = (
    <Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <HeaderBox collapsed={collapsed}>
        <IconButton
          onClick={toggleCollapsed}
          sx={{ color: "inherit" }}
          size="small"
        >
          <MenuIcon />
        </IconButton>
      </HeaderBox>
    </Box>
  );

  return (
    <Drawer variant="permanent" sx={drawerStyle}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", paddingTop: '64px', }}>
        <Box sx={{ flexGrow: 1, px: collapsed ? 0 : 2, pt: 2 }}>
          <List disablePadding>
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.label}
                item={item}
                collapsed={collapsed}
                openKeys={openKeys}
                onToggle={handleToggleOpen}
              />
            ))}
          </List>
        </Box>
        {footer}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
