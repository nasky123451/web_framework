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
import { SidebarProvider, useSidebar } from '../../../context/SidebarContext';


import { menuItems } from "./Menu";
import MenuItemComponent from "./MenuItemComponent";

import { styled } from "@mui/material/styles";

const Sidebar: React.FC = () => {
  const { themeColors } = useThemeContext();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const drawerWidth = collapsed ? 60 : 240;

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
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: {
      width: drawerWidth,
      background: getBackgroundCss(themeColors.sidebar),
      color: getBackgroundCss(themeColors.text),
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
    <SidebarProvider>
      <Drawer variant="permanent" sx={drawerStyle}>
        <Toolbar />
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
    </SidebarProvider>
  );
};

export default Sidebar;
