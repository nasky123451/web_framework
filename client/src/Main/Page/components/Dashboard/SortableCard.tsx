import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { UniqueIdentifier } from '@dnd-kit/core';

import { getBackgroundCss, useThemeContext } from '../../../../context/ThemeContext';
import styles from './index.module.css';

type SortableCardProps = {
  id: UniqueIdentifier;
  width: number;
  height: number;
  onResizeStart?: (id: UniqueIdentifier, e: React.MouseEvent) => void;
};

export const SortableCard: React.FC<SortableCardProps> = ({
  id,
  width,
  height,
  onResizeStart,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { themeColors } = useThemeContext();

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
    height,
    flexShrink: 0,
    position: 'relative',
    zIndex: isDragging ? 9999 : undefined,
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.3)' : undefined,
    cursor: 'grab',
    userSelect: 'none',
    boxSizing: 'border-box',
    willChange: 'transform',
  };

  const idStr = String(id);

  return (
    <Box ref={setNodeRef} style={style}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: getBackgroundCss(themeColors.box),
          border: '1px solid rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ cursor: 'grab', userSelect: 'none' }} {...attributes} {...listeners}>
          <CardHeader title={idStr} />
          <Divider />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            這是 {idStr} 的詳細分析資訊。
          </Typography>
        </CardContent>

        {/* Resize handle */}
        <Box
          className={styles.cornerResizeHandle}
          onMouseDown={(e) => onResizeStart?.(id, e)}
        >
          <div></div>
          <div></div>
          <div></div>
        </Box>
      </Card>
    </Box>
  );
};
