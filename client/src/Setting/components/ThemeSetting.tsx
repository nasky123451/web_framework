import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel as MuiFormControlLabel,
} from '@mui/material';
import { Tune as TuneIcon } from '@mui/icons-material';
import Cookies from 'js-cookie';
import { useThemeContext, getBackgroundCss } from '../../context/ThemeContext';
import { TechHexColorPicker } from './Theme/TechHexColorPicker';
import { GradientStopsEditor } from './Theme/GradientStopsEditor';
import type { GradientStop } from './Theme/GradientStopsEditor';
import styles from './ThemeSetting.module.css';

type ThemeParts = 'sidebar' | 'topbar' | 'box' | 'boxBackground' | 'text' | 'title' | 'background';
type GradientType = 'linear' | 'radial' | 'repeating-linear';

const ThemeSetting: React.FC = () => {
  const { themeColors, setThemeColors } = useThemeContext();

  const [selectedPart, setSelectedPart] = useState<ThemeParts>('sidebar');
  const [gradientEnabled, setGradientEnabled] = useState(false);

  // 色彩與角度設定
  const [localColorFrom, setLocalColorFrom] = useState('rgba(25, 118, 210, 1)');
  const [localColorTo, setLocalColorTo] = useState('rgba(66, 165, 245, 1)');
  const [localAngle, setLocalAngle] = useState(90);

  // 漸層停點資料，支援 rgba
  const [localStops, setLocalStops] = useState<GradientStop[]>([
    { offset: 0, color: 'rgba(25, 118, 210, 1)' },
    { offset: 1, color: 'rgba(66, 165, 245, 1)' },
  ]);

  // 複合漸層類型
  const [gradientType, setGradientType] = useState<GradientType>('linear');

  // Dialog 開關
  const [openDialog, setOpenDialog] = useState(false);

  const selectedPartRef = useRef<ThemeParts>(selectedPart);
  useEffect(() => {
    selectedPartRef.current = selectedPart;
  }, [selectedPart]);

  // 初始化本地狀態
  useEffect(() => {
    const part = themeColors[selectedPart];
    if (!part) return;
    const gradient = part.gradient;

    if (gradient?.enabled && gradient.stops?.length >= 2) {
      setGradientEnabled(true);
      setLocalColorFrom(gradient.from);
      setLocalColorTo(gradient.to);
      setLocalAngle(gradient.angle ?? 90);
      setLocalStops(gradient.stops);
      setGradientType(gradient.type ?? 'linear');
    } else {
      setGradientEnabled(false);
      setLocalColorFrom(part.color);
      setLocalColorTo(part.color);
      setLocalAngle(90);
      setLocalStops([
        { offset: 0, color: part.color },
        { offset: 1, color: part.color },
      ]);
      setGradientType('linear');
    }
  }, [selectedPart, themeColors]);

  const updateGradient = (
    from: string,
    to: string,
    angle: number,
    stops: GradientStop[],
    type: GradientType
  ) => {
    const part = selectedPartRef.current;
    setThemeColors((prev) => ({
      ...prev,
      [part]: {
        color: from,
        gradient: { enabled: true, from, to, angle, stops, type },
      },
    }));
  };
  
  const updateSingleColor = (color: string) => {
    const part = selectedPartRef.current;
    setThemeColors((prev) => ({
      ...prev,
      [part]: {
        color,
        gradient: {
          enabled: false,
          from: color,
          to: color,
          angle: 90,
          stops: [
            { offset: 0, color },
            { offset: 1, color },
          ],
          type: 'linear',
        },
      },
    }));
  };

  const debouncedUpdateSingleColor = useRef(debounce(updateSingleColor, 150)).current;
  const debouncedUpdateGradient = useRef(debounce(updateGradient, 150)).current;

  const toggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setGradientEnabled(enabled);
    if (enabled) {
      debouncedUpdateGradient(localColorFrom, localColorTo, localAngle, localStops, gradientType);
    } else {
      debouncedUpdateSingleColor(localColorFrom);
    }
  };

  const handleSave = () => {
    Cookies.set('themeColors', JSON.stringify(themeColors), { expires: 365 });
  };

  return (
    <Box
      className={styles.themeContainer}
      style={{ color: getBackgroundCss(themeColors.text), background: getBackgroundCss(themeColors.box), transition: 'all 0.3s ease' }}
    >
      <Typography variant="h4" className={styles.title} style={{ color: getBackgroundCss(themeColors.title) }}>
        主題顏色設定
      </Typography>

      <FormControl fullWidth className={styles.formControl}>
        <InputLabel>調整項目</InputLabel>
        <Select
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value as ThemeParts)}
        >
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="topbar">Topbar</MenuItem>
          <MenuItem value="sidebar">Sidebar</MenuItem>
          <MenuItem value="background">Background</MenuItem>
          <MenuItem value="boxBackground">Box Background</MenuItem>
          <MenuItem value="box">Box</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Switch checked={gradientEnabled} onChange={toggleGradient} />}
        label="啟用漸層"
      />

      <Box mt={2} display="flex" gap={2} alignItems="center">
        <Button
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() => setOpenDialog(true)}
          disabled={!gradientEnabled}
        >
          進階設定
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          儲存
        </Button>
      </Box>

      {/* 簡單調整 */}
      {!gradientEnabled && (
        <Box mt={2}>
          <Typography variant="subtitle1">單色顏色</Typography>
          <TechHexColorPicker
            color={localColorFrom}
            onChange={(color) => {
              setLocalColorFrom(color);
              debouncedUpdateSingleColor(color);
            }}
          />
        </Box>
      )}

      {/* Dialog 內詳細編輯 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>漸層詳細設定</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gradient-type-label">漸層類型</InputLabel>
            <Select
              labelId="gradient-type-label"
              value={gradientType}
              label="漸層類型"
              onChange={(e) => {
                setGradientType(e.target.value as GradientType);
                debouncedUpdateGradient(localColorFrom, localColorTo, localAngle, localStops, e.target.value as GradientType);
              }}
            >
              <MenuItem value="linear">線性漸層</MenuItem>
              <MenuItem value="radial">放射狀漸層</MenuItem>
              <MenuItem value="repeating-linear">重複線性漸層</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ mb: 3 }}>
            <Typography gutterBottom>漸層角度 ({localAngle}°)</Typography>
            <Slider
              min={0}
              max={360}
              step={1}
              value={localAngle}
              onChange={(_, val) => {
                if (typeof val === 'number') {
                  setLocalAngle(val);
                  debouncedUpdateGradient(localColorFrom, localColorTo, localAngle, localStops, 'linear');
                }
              }}
              valueLabelDisplay="auto"
            />
          </FormControl>

          <GradientStopsEditor
            stops={localStops}
            onChange={(newStops) => {
              setLocalStops(newStops);
              debouncedUpdateGradient(localColorFrom, localColorTo, localAngle, newStops, gradientType);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>關閉</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ThemeSetting;
