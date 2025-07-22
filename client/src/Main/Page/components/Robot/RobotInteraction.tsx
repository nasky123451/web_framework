import React, { useState } from 'react';
import { Box, Typography, Fade, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRobotMenuItems } from './RobotMenuItems';
import RobotGoToDialog from './RobotGoToDialog';
import UserProfileDialog from '../UserProfileDialog';
import { menuItems as mainMenuItems } from "../Menu";
import { useThemeContext, getColorCss } from '../../../../context/ThemeContext';
import styles from './index.module.css';

interface RobotInteractionProps {
  open: boolean;
  onSettingsClick?: () => void;
  onNavigateClick?: () => void;
}

const RobotInteraction: React.FC<RobotInteractionProps> = ({
  open,
  onSettingsClick,
}) => {
  const { themeColors } = useThemeContext();
  const navigate = useNavigate();
  const [goToOpen, setGoToOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileClick = () => setProfileOpen(true);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };
  

  const menuItems = getRobotMenuItems(
    navigate,
    handleProfileClick,
    onSettingsClick,
    () => setGoToOpen(true),
    handleLogout
  );
  

  return (
    <>
      <Fade in={open} unmountOnExit>
        <Box style={{ color: getColorCss(themeColors.text) }} className={styles.interactionBox}>
          <Typography variant="h6" className={styles.title}>
            請問您想要做什麼？
          </Typography>

          <Box className={styles.buttonGroup}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="contained"
                startIcon={item.icon}
                onClick={item.onClick}
                className={styles.actionButton}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Fade>

      <RobotGoToDialog
        open={goToOpen}
        onClose={() => setGoToOpen(false)}
        menuItems={mainMenuItems}
        />

        <UserProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

export default RobotInteraction;
