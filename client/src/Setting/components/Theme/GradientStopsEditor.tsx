import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Popover,
} from '@mui/material';
import {
  DragHandle as DragHandleIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { TechHexColorPicker } from './TechHexColorPicker';

export interface GradientStop {
  offset: number; // 0~1
  color: string; // rgba(...) 或 hex (#rrggbbaa)
}

interface GradientStopsEditorProps {
  stops: GradientStop[];
  onChange: (stops: GradientStop[]) => void;
  maxStops?: number;
  minStops?: number;
  /** 可選：自訂新增停點的預設色與位置 */
  newStopDefault?: GradientStop;
}

export const GradientStopsEditor: React.FC<GradientStopsEditorProps> = ({
  stops,
  onChange,
  maxStops = 10,
  minStops = 2,
  newStopDefault = { offset: 0.5, color: '#ffffff' },
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const updateStop = (index: number, updatedStop: GradientStop) => {
    const newStops = [...stops];
    newStops[index] = updatedStop;
    onChange(newStops);
  };

  const handleDelete = (index: number) => {
    if (stops.length <= minStops) return; // 最小數量限制
    const newStops = stops.filter((_, i) => i !== index);
    onChange(newStops);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const draggedIndex = Number(e.dataTransfer.getData('drag-index'));
    if (draggedIndex === index) return;
    const newStops = [...stops];
    const [dragged] = newStops.splice(draggedIndex, 1);
    newStops.splice(index, 0, dragged);
    onChange(newStops);
  };

  const handleAddStop = () => {
    if (stops.length >= maxStops) return; // 最大數量限制
    onChange([...stops, newStopDefault]);
  };

  const handleColorClick = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setActiveIndex(index);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setActiveIndex(null);
  };

  const open = Boolean(anchorEl);
  const currentColor = activeIndex !== null ? stops[activeIndex].color : '#ffffff';

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        漸層色停點 (拖曳排序)
      </Typography>

      {stops.map((stop, idx) => (
        <Box
          key={idx}
          draggable
          onDragStart={(e) => e.dataTransfer.setData('drag-index', String(idx))}
          onDrop={(e) => handleDragEnd(e, idx)}
          onDragOver={(e) => e.preventDefault()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            p: 1.2,
            mt: 1,
            backgroundColor: 'background.paper',
            boxShadow: 1,
          }}
          aria-label={`漸層停點第${idx + 1}筆`}
        >
          <DragHandleIcon sx={{ cursor: 'grab' }} />

          <Typography variant="body2" sx={{ width: 60 }}>
            Stop {idx + 1}
          </Typography>

          <TextField
            type="number"
            size="small"
            label="Offset"
            value={stop.offset}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val >= 0 && val <= 1) {
                updateStop(idx, { ...stop, offset: val });
              }
            }}
            inputProps={{ step: 0.01, min: 0, max: 1 }}
            sx={{ width: 90 }}
          />

          <Box
            onClick={(e) => handleColorClick(e, idx)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              border: '2px solid #888',
              background: stop.color,
              cursor: 'pointer',
            }}
            aria-label={`停點${idx + 1}色彩預覽`}
          />

          <IconButton
            size="small"
            onClick={() => handleDelete(idx)}
            disabled={stops.length <= minStops}
            aria-label={`刪除停點${idx + 1}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      <Box mt={2}>
        <IconButton
          onClick={handleAddStop}
          disabled={stops.length >= maxStops}
          aria-label="新增漸層停點"
          color="primary"
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* 色彩選擇彈出視窗 */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box p={2}>
          <TechHexColorPicker
            color={currentColor}
            onChange={(newColor) => {
              if (activeIndex !== null) {
                updateStop(activeIndex, { ...stops[activeIndex], color: newColor });
              }
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
};
