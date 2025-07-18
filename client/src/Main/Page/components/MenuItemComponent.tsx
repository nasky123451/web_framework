import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
  Popover,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import type { MenuItemType } from "./Menu";

interface MenuItemComponentProps {
  item: MenuItemType;
  collapsed: boolean;
  openKeys: Set<string>;
  onToggle: (label: string) => void;
  level?: number;
}

const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  item,
  collapsed,
  openKeys,
  onToggle,
  level = 0,
}) => {
  const location = useLocation();
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const isOpen = openKeys.has(item.label);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    onToggle(item.label);
  };

  const handleClose = () => setAnchorEl(null);

  const content = (
    <>
      {item.icon && <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>}
      {!collapsed && <ListItemText primary={item.label} />}
      {!collapsed && hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </>
  );

  if (hasChildren && collapsed) {
    return (
      <>
        <Tooltip title={item.label} placement="right">
          <ListItemButton onClick={handleClick}>
            {content}
          </ListItemButton>
        </Tooltip>
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            onMouseLeave: handleClose,
            sx: { pointerEvents: "auto" },
          }}
        >
          <List>
            {item.children!.map(child => (
              <MenuItemComponent
                key={child.label}
                item={child}
                collapsed={false}
                openKeys={openKeys}
                onToggle={onToggle}
                level={level + 1}
              />
            ))}
          </List>
        </Popover>
      </>
    );
  }

  if (hasChildren) {
    return (
      <>
        <ListItemButton onClick={() => onToggle(item.label)}>
          {content}
        </ListItemButton>
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          {item.children!.map(child => (
            <MenuItemComponent
              key={child.label}
              item={child}
              collapsed={collapsed}
              openKeys={openKeys}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </Collapse>
      </>
    );
  }

  if (item.path) {
    return (
      <Tooltip title={collapsed ? item.label : ""} placement="right">
        <ListItemButton
          component={NavLink}
          to={item.path}
          selected={location.pathname === item.path}
        >
          {content}
        </ListItemButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={collapsed ? item.label : ""} placement="right">
      <ListItemButton>{content}</ListItemButton>
    </Tooltip>
  );
};

export default MenuItemComponent;
