import React, { useState } from 'react';
import {
  ListItemButton as MuiListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText, Box,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import type { Variants } from 'framer-motion';
import type { MenuItemType } from '../Menu';
import { useNavigate } from 'react-router-dom';
import { getColorCss, useThemeContext } from '../../../../context/ThemeContext';
import styles from './index.module.css';
import { styled } from '@mui/material/styles';

interface RobotGoToFloatingMenuProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItemType[];
}

const RobotGoToFloatingMenu: React.FC<RobotGoToFloatingMenuProps> = ({
  open,
  onClose,
  menuItems,
}) => {
  const { themeColors } = useThemeContext();
  const navigate = useNavigate();

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleClick = (path?: string) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      {/* 背景遮罩（永遠渲染，但動畫控制） */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* 選單動畫列表 */}
            <AnimatePresence>
        {open &&
          menuItems.map((item, i) => (
            <motion.div
              key={item.label}
              className={styles.floatingItem}
              custom={i}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              style={{ top: 100 + i * 70, color: getColorCss(themeColors.text) }}
            >
              <ListItemButton
                onClick={() =>
                  item.children ? toggleSubmenu(item.label) : handleClick(item.path)
                }
                // 用 flex 布局讓文字跟箭頭左右分散
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </Box>
                {/* 子選單箭頭 */}
                {item.children && (
                  openSubmenu === item.label ? (
                    <ExpandLess sx={{ color: '#004d40' }} />
                  ) : (
                    <ExpandMore sx={{ color: '#004d40' }} />
                  )
                )}
              </ListItemButton>
              {/* 子選單折疊動畫 */}
              <AnimatePresence>
                {item.children && openSubmenu === item.label && (
                  <motion.div
                    key={`${item.label}-submenu`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={childVariants}
                    style={{ marginLeft: 20, marginTop: 8 }}
                  >
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        sx={{ mt: 1, borderRadius: 2 }}
                        onClick={() => handleClick(subItem.path)}
                      >
                        {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </AnimatePresence>
    </>
  );
};

export default RobotGoToFloatingMenu;

const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.spacing(1), // 8px
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  background: 'linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)',
  color: '#004d40',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    background: 'linear-gradient(135deg, #80deea 0%, #4db6ac 100%)',
    transform: 'scale(1.05)',
    '& .MuiListItemIcon-root': {
      color: '#004d40',
    },
  },
  '&.Mui-focusVisible': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
}));

const ListItemIcon = styled(MuiListItemIcon)({
  color: '#00796b',
  transition: 'color 0.3s ease',
});

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      type: 'spring' as const,
      stiffness: 300,
      damping: 20,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 100,
    transition: {
      delay: i * 0.03,
      duration: 0.2,
    },
  }),
};

// Variants for child list sliding in
const childVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'tween',
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.2,
    },
  },
};
