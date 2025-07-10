// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    <>
      <Topbar />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px" }}>
        <Toolbar /> {/* for topbar spacing */}
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
