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
  const paddingLeft = collapsed ? 2 : 4 + level * 2;

  // Popover 狀態改為點擊控制
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
      onToggle(item.label); // 同步開關側邊欄內部狀態（如果有）
    } else {
      setAnchorEl(event.currentTarget);
      onToggle(item.label);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  const content = (
    <>
      {item.icon && <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>}
      {!collapsed && <ListItemText primary={item.label} />}
      {!collapsed && hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </>
  );

  if (hasChildren) {
    if (collapsed) {
      return (
        <>
          <Tooltip title={item.label} placement="right">
            <ListItemButton
              onClick={handleClick}
              sx={{ pl: paddingLeft }}
              aria-haspopup="true"
              aria-expanded={popoverOpen}
            >
              {content}
            </ListItemButton>
          </Tooltip>

          <Popover
            open={popoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            disableRestoreFocus
            disableAutoFocus
            PaperProps={{
              onMouseLeave: handleClose,
              sx: { pointerEvents: "auto" },
            }}
          >
            <List component="nav" sx={{ minWidth: 200 }}>
              {item.children!.map((child) => (
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
    } else {
      return (
        <>
          <Tooltip title="" placement="right">
            <ListItemButton
              onClick={() => onToggle(item.label)}
              sx={{ pl: paddingLeft }}
            >
              {content}
            </ListItemButton>
          </Tooltip>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {item.children!.map((child) => (
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
  } else if (item.path) {
    return (
      <Tooltip title={collapsed ? item.label : ""} placement="right">
        <ListItemButton
          component={NavLink}
          to={item.path}
          selected={location.pathname === item.path}
          sx={{ pl: paddingLeft }}
        >
          {content}
        </ListItemButton>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title={collapsed ? item.label : ""} placement="right">
        <ListItemButton sx={{ pl: paddingLeft }}>{content}</ListItemButton>
      </Tooltip>
    );
  }
};

export default MenuItemComponent;
