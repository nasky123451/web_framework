import {
    Dashboard,
    Settings,
    Tune,
    Palette,
    Info,
  } from "@mui/icons-material";
  import React from "react";
  
  export interface MenuItemType {
    label: string;
    icon?: React.ReactNode;
    path?: string; // 有路由才是連結
    children?: MenuItemType[];
  }
  
  export const menuItems: MenuItemType[] = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    {
      label: "Settings",
      icon: <Settings />,
      children: [
        { label: "Theme", icon: <Palette />, path: "/settings/theme" },
        { label: "System", icon: <Tune />, path: "/settings/system" },
        { label: "About", icon: <Info />, path: "/settings/about" },
      ],
    },
  ];
  