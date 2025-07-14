import React from "react";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Tooltip,
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

  const content = (
    <>
      {item.icon && (
        <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
      )}
      {!collapsed && <ListItemText primary={item.label} />}
      {!collapsed && hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
    </>
  );

  if (hasChildren) {
    return (
      <>
        <Tooltip title={collapsed ? item.label : ""} placement="right">
          <ListItemButton
            onClick={() => onToggle(item.label)}
            sx={{ pl: paddingLeft }}
          >
            {content}
          </ListItemButton>
        </Tooltip>
        <Collapse in={!collapsed && isOpen} timeout="auto" unmountOnExit>
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
    // 如果沒有路由也沒有子選單，就只顯示 label 與 icon（可自由調整）
    return (
      <Tooltip title={collapsed ? item.label : ""} placement="right">
        <ListItemButton sx={{ pl: paddingLeft }}>
          {content}
        </ListItemButton>
      </Tooltip>
    );
  }
};

export default MenuItemComponent;
