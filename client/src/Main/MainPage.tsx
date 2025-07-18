import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Fade,
} from '@mui/material';
import Topbar from './Page/components/Topbar';
import Sidebar from './Page/components/Sidebar';
import RobotInteraction from './Page/components/RobotInteraction'; 
import { Outlet } from 'react-router-dom';
import { useThemeContext, getBackgroundCss } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { useMode } from '../context/ModeContext';
import robotImage from '../image/robot.png';

import styles from './index.module.css';

const MainPage: React.FC = () => {
  const { themeColors } = useThemeContext();
  const { getSidebarWidth } = useSidebar();
  const { mode } = useMode();

  const drawerWidth = getSidebarWidth();

  const [loading, setLoading] = useState(true);
  const [robotOpen, setRobotOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <>
      {mode === 'standard' && (
        <>
          <Sidebar />
          <Box
            className={styles.standardContent}
            style={{ paddingLeft: `${drawerWidth}px`, background: getBackgroundCss(themeColors.background) }}
          >
            <Topbar />
            <Box className={styles.standardContentInner}>
              <Outlet />
            </Box>
          </Box>
        </>
      )}

      {mode === 'assistant' && (
        <Box
          className={styles.assistantContent}
        >
          <Outlet />

          {/* 右下角機器人 */}
          <Box
            component="img"
            src={robotImage}
            alt="機器助手"
            onClick={() => setRobotOpen(!robotOpen)}
            className={`${styles.robotButton} ${robotOpen ? styles.robotButtonActive : ''}`}
          />

          {/* 互動視窗 */}
          <RobotInteraction open={robotOpen} />
        </Box>
      )}
    </>
  );
};

export default MainPage;
