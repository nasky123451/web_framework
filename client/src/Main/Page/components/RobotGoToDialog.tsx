import React from 'react';
import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import type { MenuItemType } from "./Menu";
import { useNavigate } from 'react-router-dom';

interface RobotGoToDialogProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItemType[];
}

const RobotGoToDialog: React.FC<RobotGoToDialogProps> = ({ open, onClose, menuItems }) => {
  const navigate = useNavigate();
  const [openSub, setOpenSub] = React.useState<string | null>(null);

  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="goto-dialog-title">
      <DialogTitle id="goto-dialog-title">選擇前往頁面</DialogTitle>
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItemButton
              onClick={() => {
                if (item.children) {
                  setOpenSub(openSub === item.label ? null : item.label);
                } else {
                  handleItemClick(item.path);
                }
              }}
              aria-expanded={item.children ? openSub === item.label : undefined}
              aria-controls={item.children ? `${item.label}-submenu` : undefined}
              id={`${item.label}-button`}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText primary={item.label} />
              {item.children && (openSub === item.label ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {item.children && (
              <Collapse
                in={openSub === item.label}
                timeout="auto"
                unmountOnExit
                id={`${item.label}-submenu`}
                aria-labelledby={`${item.label}-button`}
              >
                <List component="div" disablePadding>
                  {item.children.map((subItem) => (
                    <ListItemButton
                      key={subItem.label}
                      sx={{ pl: 4 }}
                      onClick={() => handleItemClick(subItem.path)}
                    >
                      {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                      <ListItemText primary={subItem.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Dialog>
  );
};

export default RobotGoToDialog;
