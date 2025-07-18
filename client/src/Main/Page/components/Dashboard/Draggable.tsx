import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
  type DragOverEvent,
  MeasuringStrategy,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Box,
} from '@mui/material';
import { SortableCard } from './SortableCard';
import styles from './index.module.css';

interface DraggableCardGridProps {
  data: UniqueIdentifier[];
  onOrderChange?: (newOrder: UniqueIdentifier[]) => void;
}

const defaultCardSize = { width: 300, height: 200 };

export const DraggableCardGrid: React.FC<DraggableCardGridProps> = ({ data, onOrderChange }) => {
  const [items, setItems] = useState<UniqueIdentifier[]>(data);
  const [sizes, setSizes] = useState<Record<UniqueIdentifier, { width: number; height: number }>>({});

  const resizingId = useRef<UniqueIdentifier | null>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || over.id === active.id) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onOrderChange?.(newItems);
    }
  };

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Box  className={styles.gridContainer}>
            {items.map((id, index) => {
            return (
              <SortableCard
                  id={id}
                  width={sizes[id]?.width || defaultCardSize.width}
                  height={sizes[id]?.height || defaultCardSize.height}
                  onResizeStart={handleResizeStart}
              />
            );
            })}
        </Box>
      </SortableContext>
    </DndContext>
  );
};
