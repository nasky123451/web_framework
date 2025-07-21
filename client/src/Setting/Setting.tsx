import React from "react";
import { Outlet, NavLink, useMatch, useResolvedPath } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import clsx from "clsx";
import { useThemeContext, getColorCss } from "../context/ThemeContext";

import FullHeightFlexProps from "./FullHeightFlex.tsx";

import styles from "./index.module.css";

const CustomNavItem = ({ label, path }: { label: string; path: string }) => {
  const resolved = useResolvedPath(`/settings/${path}`);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <ListItemButton
      component={NavLink}
      to={`/settings/${path}`}
      className={clsx(styles.navItem, match && styles.active)}
    >
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

const menuItems = [
  { label: "主題設定", path: "theme" },
  { label: "模式設定", path: "mode" },
  { label: "關於本系統", path: "about" },
];

const SettingPage: React.FC = () => {
  const { themeColors } = useThemeContext();

  return (
    <FullHeightFlexProps>
      <Box
        component="nav"
        className={styles.nav}
        style={{
          color: getColorCss(themeColors.text),
          background: getColorCss(themeColors.sidebar),
        }}
      >
        <Typography
          variant="h6"
          className={styles.title}
          sx={{ color: getColorCss(themeColors.title) }}
        >
          設定功能
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List className={styles.list}>
          {menuItems.map(({ label, path }) => (
            <CustomNavItem key={path} label={label} path={path} />
          ))}
        </List>
      </Box>

      <Box
        component="main"
        className={styles.main}
        style={{
          background: getColorCss(themeColors.background),
        }}
      >
        <Paper
          elevation={3}
          className={styles.paper}
          style={{
            background: getColorCss(themeColors.boxBackground),
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </FullHeightFlexProps>
  );
};

export default SettingPage;
