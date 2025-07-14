import React, { useState } from "react";
import {
  Box,
  Toolbar,
  Drawer,
  List,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useThemeContext, getBackgroundCss } from "../../context/ThemeContext";

import { menuItems } from "./Menu";
import MenuItemComponent from "./MenuItemComponent";

import { styled } from "@mui/material/styles";
import styles from "./index.module.css";

const Sidebar: React.FC = () => {
  const { themeColors } = useThemeContext();
  const [collapsed, setCollapsed] = useState(false);

  // 支援多組展開，所以用 Set 管理開啟的標籤
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  const drawerWidth = collapsed ? 60 : 240;

  const handleToggleOpen = (label: string) => {
    setOpenKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
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
  
  const header = (
    <HeaderBox collapsed={collapsed}>
      <IconButton
        onClick={() => setCollapsed((prev) => !prev)}
        sx={{ color: "inherit" }}
        size="small"
      >
        <MenuIcon />
      </IconButton>
    </HeaderBox>
  );

  return (
    <Drawer variant="permanent" className={styles.drawerPaper} sx={drawerStyle}>
      <Toolbar />
      <Box px={collapsed ? 0 : 2}>
        {header}
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
    </Drawer>
  );
};

export default Sidebar;
