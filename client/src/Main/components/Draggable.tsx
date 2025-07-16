import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  DragOverlay,
  type UniqueIdentifier,
  type DragOverEvent,
  type DragCancelEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import { blue, green, purple } from '@mui/material/colors';
import { getBackgroundCss, useThemeContext } from '../../context/ThemeContext';
import styles from './index.module.css';

interface DraggableCardGridProps {
  data: UniqueIdentifier[];
  onOrderChange?: (newOrder: UniqueIdentifier[]) => void;
}

const colors = [blue[500], green[500], purple[500]];
const defaultCardSize = { width: 300, height: 200 };

export const DraggableCardGrid: React.FC<DraggableCardGridProps> = ({ data, onOrderChange }) => {
  const { themeColors } = useThemeContext();
  const theme = useTheme();
  const [items, setItems] = useState<UniqueIdentifier[]>(data);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Record<UniqueIdentifier, { width: number; height: number }>>({});

  const resizingId = useRef<UniqueIdentifier | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // 追蹤上一個 dragOverIndex，避免無限更新
  const lastOverIndexRef = useRef<number | null>(null);

  useEffect(() => {
    setItems((prev) => {
      if (prev.join(',') !== data.join(',')) return data;
      return prev;
    });
    setSizes((prev) => {
      const updated = { ...prev };
      data.forEach((id) => {
        if (!updated[id]) updated[id] = { ...defaultCardSize };
      });
      return updated;
    });
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor));

  // 透過函式取得顯示的列表(插入 placeholder)
  const getDisplayItems = (): (UniqueIdentifier | 'placeholder')[] => {
    if (activeId != null && dragOverIndex != null) {
      const filtered = items.filter((id) => id !== activeId);
      return [
        ...filtered.slice(0, dragOverIndex),
        'placeholder',
        ...filtered.slice(dragOverIndex),
      ];
    }
    return items;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    setActiveId(id);
    const index = items.findIndex((itemId) => itemId === id);
    setDragOverIndex(index);
    lastOverIndexRef.current = index;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === 'placeholder') return;
    if (active.id === over.id) return;

    const overIndex = items.indexOf(over.id);
    if (overIndex === -1) return;

    if (lastOverIndexRef.current !== overIndex) {
      lastOverIndexRef.current = overIndex;
      setDragOverIndex(overIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDragOverIndex(null);
    lastOverIndexRef.current = null;

    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onOrderChange?.(newItems);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDragOverIndex(null);
    lastOverIndexRef.current = null;
  };

  // 縮放相關
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!resizingId.current || !lastPos.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setSizes((prev) => {
        const old = prev[resizingId.current!];
        if (!old) return prev;
        return {
          ...prev,
          [resizingId.current!]: {
            width: Math.max(150, old.width + dx),
            height: Math.max(100, old.height + dy),
          },
        };
      });
    };

    const onMouseUp = () => {
      resizingId.current = null;
      lastPos.current = null;
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const handleResizeStart = (id: UniqueIdentifier, e: React.MouseEvent) => {
    e.stopPropagation();
    resizingId.current = id;
    lastPos.current = { x: e.clientX, y: e.clientY };
    document.body.style.userSelect = 'none';
  };

  function SortableCard({
    id,
    width,
    height,
    isDragging,
  }: {
    id: UniqueIdentifier;
    width: number;
    height: number;
    isDragging: boolean;
  }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging,
    } = useSortable({ id });

    const style = {
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      transition,
      width,
      height,
      flexShrink: 0,
      position: 'relative' as const,
      zIndex: isDragging ? 9999 : undefined,
      boxShadow: isSortableDragging ? '0 8px 16px rgba(0,0,0,0.3)' : undefined,
      cursor: 'grab',
      userSelect: 'none' as const,
      boxSizing: 'border-box' as const,
    };

    const idStr = String(id);
    const colorIndex = idStr.charCodeAt(0) % colors.length;

    return (
      <Box component="div" ref={setNodeRef} style={style} {...attributes} className={styles.gridItem}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: getBackgroundCss(themeColors.box),
            border: isDragging ? '2px dashed #1976d2' : '1px solid rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box {...listeners} sx={{ cursor: 'grab', userSelect: 'none' }}>
            <CardHeader avatar={<Avatar sx={{ bgcolor: colors[colorIndex] }}>{idStr[0]}</Avatar>} title={idStr} subheader={`資料分析項目 #${items.indexOf(id) + 1}`} />
            <Divider />
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              這是 {idStr} 的詳細分析資訊。
            </Typography>
          </CardContent>
          <Box
            onMouseDown={(e) => handleResizeStart(id, e)}
            sx={{ width: 20, height: 20, position: 'absolute', right: 4, bottom: 4, cursor: 'nwse-resize', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '3px', zIndex: 10 }}
          />
        </Card>
      </Box>
    );
  }

  function PlaceholderCard({ width, height }: { width: number; height: number }) {
    return (
      <Box
        className={styles.gridItem}
        style={{
          width,
          height,
          border: '2px dashed #1976d2',
          borderRadius: 8,
          backgroundColor: 'rgba(25,118,210,0.15)',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
        aria-hidden
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext items={items}>
        <Box className={styles.gridContainer}>
          {getDisplayItems().map((id) => {
            if (id === 'placeholder') {
              const placeholderSize = activeId ? sizes[activeId] || defaultCardSize : defaultCardSize;
              return <PlaceholderCard key="placeholder" width={placeholderSize.width} height={placeholderSize.height} />;
            }
            const isDragging = activeId === id;
            return <SortableCard key={id} id={id} width={sizes[id]?.width || defaultCardSize.width} height={sizes[id]?.height || defaultCardSize.height} isDragging={isDragging} />;
          })}
        </Box>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <Box
            style={{
              width: sizes[activeId]?.width || defaultCardSize.width,
              height: sizes[activeId]?.height || defaultCardSize.height,
              background: getBackgroundCss(themeColors.box),
              border: '2px dashed #1976d2',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              borderRadius: 8,
            }}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
