import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Fade,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Topbar from './Page/components/Topbar';
import Sidebar from './Page/components/Sidebar';
import RobotInteraction from './Page/components/Robot/RobotInteraction'; 
import { Outlet } from 'react-router-dom';
import { useThemeContext, getColorCss } from '../context/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { useMode } from '../context/ModeContext';
import robotImage from '../image/robot.png';

import styles from './index.module.css';

export const toggleButtonVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const toggleButtonTransition = {
  duration: 0.3,
  ease: 'easeOut' as const,
};

const MainPage: React.FC = () => {
  const { themeColors } = useThemeContext();
  const { getSidebarWidth } = useSidebar();
  const { mode } = useMode();

  const drawerWidth = getSidebarWidth();

  const [loading, setLoading] = useState(true);
  const [robotOpen, setRobotOpen] = useState(false);
  const [robotOpenVisible, setRobotOpenVisible] = useState(true);

  const robotVariants: Variants = {
    initial: { opacity: 0, x: 40, y: 40, scale: 0.95 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
    floating: {
      y: [0, -5, 0, 5, 0],
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    exit: { opacity: 0, x: 40, y: 40, scale: 0.95 },
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!robotOpenVisible) {
      setRobotOpen(false);
    }
  }, [robotOpenVisible]);

  if (loading) return <CircularProgress />;

  return (
    <>
      {mode === 'standard' && (
        <>
          <Sidebar />
          <Box
            className={styles.standardContent}
            style={{ paddingLeft: `${drawerWidth}px`, background: getColorCss(themeColors.background) }}
          >
            <Topbar />
            <Box className={`${styles.standardContentInner} ${styles.customScrollContainer}`}>
              <Outlet />
            </Box>
          </Box>
        </>
      )}

      {mode === 'assistant' && (
        <Box className={styles.assistantContent}>
            <Box className={styles.customScrollContainer} style={{ height: '100%' }}>
              <Outlet />
            </Box>

          {/* 切換按鈕動畫 */}
          <AnimatePresence>
            <motion.div
              key="toggle-button"
              onClick={() => setRobotOpenVisible((prev) => !prev)}
              variants={toggleButtonVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={toggleButtonTransition}
              className={styles.toggleButton}
            >
              {robotOpenVisible ? (
                <ChevronRight fontSize="small" />
              ) : (
                <ChevronLeft fontSize="small" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 機器人圖示動畫（出現／消失） */}
          <AnimatePresence>
            {robotOpenVisible && (
              <motion.img
                key="robot-button"
                src={robotImage}
                alt="機器助手"
                onClick={() => setRobotOpen(!robotOpen)}
                className={`${styles.robotButton} ${robotOpen ? styles.robotButtonActive : ''}`}
                variants={robotVariants}
                initial="initial"
                animate={robotOpen ? 'floating' : 'visible'}
                exit="exit"
              />
            )}
          </AnimatePresence>

          {/* 機器人互動視窗 */}
          <RobotInteraction open={robotOpen} />
        </Box>
      )}
    </>
  );
};

export default MainPage;
