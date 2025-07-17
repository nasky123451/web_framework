import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import Topbar from './Page/components/Topbar';
import Sidebar from './Page/components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useThemeContext, getBackgroundCss } from '../context/ThemeContext';

const DashboardPage: React.FC = () => {
  const { themeColors } = useThemeContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'auto' }}>
      <Sidebar />
  
      {/* 右側主內容區：上下結構 */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Topbar /> {/* fixed */}
  
        {/* 下方內容區，必須要有 overflowY: 'auto'，才能內部滾動 */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            background: getBackgroundCss(themeColors.background),
            paddingTop: '64px', // 避開被 fixed 的 Topbar 蓋住的部分
            paddingX: 2,
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
