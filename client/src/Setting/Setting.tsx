import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { useThemeContext, getBackgroundCss } from "../context/ThemeContext";

import FullHeightFlexProps from "./FullHeightFlex.tsx";

const menuItems = [
  { label: "主題設定", path: "theme" },
  // 你可以加更多設定頁面
];

const SettingPage: React.FC = () => {
  const { themeColors } = useThemeContext();

  return (
    <FullHeightFlexProps>
      {/* 左側選單 */}
      <Box
        component="nav"
        sx={{
          width: 280,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          p: 2,
          boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
          overflowY: "auto",
          color: getBackgroundCss(themeColors.text),
          background: getBackgroundCss(themeColors.sidebar),
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ letterSpacing: 1, color: getBackgroundCss(themeColors.title) }}
        >
          設定功能
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map(({ label, path }) => (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 1,
                mb: 1,
                "&.active": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                  boxShadow: "0 0 8px rgba(25,118,210,0.5)",
                },
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* 右側內容區 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          bgcolor: "#e9eef3",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: getBackgroundCss(themeColors.background),
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 900,
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            background: getBackgroundCss(themeColors.boxBackground),
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </FullHeightFlexProps>
  );
};

export default SettingPage;
