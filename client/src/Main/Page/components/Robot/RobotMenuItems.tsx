import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon, // 加入登出 icon
} from '@mui/icons-material';

import type { MenuItemType } from '../Menu';
import type { NavigateFunction } from 'react-router-dom';

export interface RobotMenuItemType {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const getRobotMenuItems = (
  navigate: NavigateFunction,
  onProfileClick?: () => void,
  onSettingsClick?: () => void,
  onNavigateClick?: () => void,
  onLogoutClick?: () => void // 👈 新增 logout handler
): RobotMenuItemType[] => [
  {
    label: '查看個人資訊',
    icon: <PersonIcon />,
    onClick: () => {
      onProfileClick?.();
    },
  },
  {
    label: '設定',
    icon: <SettingsIcon />,
    onClick: () => {
      window.open('/settings', '_blank');
    },
  },
  {
    label: '前往',
    icon: <ArrowForwardIcon />,
    onClick: () => onNavigateClick?.(),
  },
  {
    label: '登出',
    icon: <LogoutIcon />,
    onClick: () => {
      onLogoutClick?.();
    },
  },
];
