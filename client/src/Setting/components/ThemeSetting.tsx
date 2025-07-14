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
} from '@mui/material';
import Cookies from 'js-cookie';
import { useThemeContext, getBackgroundCss } from '../../context/ThemeContext';
import { TechHexColorPicker } from './TechHexColorPicker';
import styles from './ThemeSetting.module.css';

type ThemeParts = 'sidebar' | 'topbar' | 'box' | 'text' | 'background';

const ThemeSetting: React.FC = () => {
  const { themeColors, setThemeColors } = useThemeContext();

  const [selectedPart, setSelectedPart] = useState<ThemeParts>('sidebar');
  const [gradientEnabled, setGradientEnabled] = useState(false);

  // ✅ local 狀態避免 flicker
  const [localColorFrom, setLocalColorFrom] = useState('#1976d2');
  const [localColorTo, setLocalColorTo] = useState('#42a5f5');
  const [localAngle, setLocalAngle] = useState(90);

  // 初始化每個元件的設定
  useEffect(() => {
    const part = themeColors[selectedPart];
    if (!part) return;

    const gradient = part.gradient;

    if (gradient?.enabled && gradient.stops?.length >= 2) {
      setGradientEnabled(true);
      setLocalColorFrom(gradient.stops[0].color);
      setLocalColorTo(gradient.stops[1].color);
      setLocalAngle(gradient.angle || 90);
    } else {
      setGradientEnabled(false);
      setLocalColorFrom(part.color || '#1976d2');
      setLocalColorTo(part.color || '#42a5f5');
      setLocalAngle(90);
    }
  }, [selectedPart, themeColors]);

  const updateGradient = (from: string, to: string, angle: number) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
        color: from,
        gradient: {
          enabled: true,
          from,
          to,
          angle,
          stops: [
            { offset: 0, color: from },
            { offset: 1, color: to },
          ],
        },
      },
    }));
  };

  const updateSingleColor = (color: string) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
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
        },
      },
    }));
  };

  useEffect(() => {
    Cookies.set('themeColors', JSON.stringify(themeColors), { expires: 365 });
  }, [themeColors]);

  // ✅ debounce 更新 context
  const debouncedUpdateSingleColor = useRef(debounce(updateSingleColor, 150)).current;
  const debouncedUpdateGradient = useRef(debounce(updateGradient, 150)).current;

  const toggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setGradientEnabled(enabled);
    if (enabled) {
      debouncedUpdateGradient(localColorFrom, localColorTo, localAngle);
    } else {
      debouncedUpdateSingleColor(localColorFrom);
    }
  };

  return (
    <Box className={styles.themeContainer} style={{ color: getBackgroundCss(themeColors.text) }}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        主題顏色設定
      </Typography>

      <FormControl fullWidth className={styles.formControl}>
        <InputLabel id="select-part-label" sx={{ color: '#a0c3d9 !important' }}>
          調整項目
        </InputLabel>
        <Select
          labelId="select-part-label"
          value={selectedPart}
          onChange={(e) => setSelectedPart(e.target.value as ThemeParts)}
          sx={{ color: '#00ffe1', fontFamily: "'Orbitron', sans-serif" }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#001011',
                color: '#00ffe1',
                fontFamily: "'Orbitron', sans-serif",
              },
            },
          }}
        >
          <MenuItem value="sidebar">Sidebar</MenuItem>
          <MenuItem value="topbar">Topbar</MenuItem>
          <MenuItem value="box">Box</MenuItem>
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="background">Background</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={gradientEnabled}
            onChange={toggleGradient}
            classes={{
              switchBase: styles.switchBase,
              checked: styles.switchChecked,
              track: gradientEnabled ? styles.switchTrackChecked : '',
            }}
          />
        }
        label="啟用漸層"
        className={styles.formControlLabel}
      />

      {gradientEnabled ? (
        <>
          <Box>
            <Typography variant="subtitle1" className={styles.subtitle}>
              漸層起始色
            </Typography>
            <TechHexColorPicker
              color={localColorFrom}
              onChange={(color) => {
                setLocalColorFrom(color);
                debouncedUpdateGradient(color, localColorTo, localAngle);
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" className={styles.subtitle}>
              漸層結束色
            </Typography>
            <TechHexColorPicker
              color={localColorTo}
              onChange={(color) => {
                setLocalColorTo(color);
                debouncedUpdateGradient(localColorFrom, color, localAngle);
              }}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" className={styles.subtitle}>
              漸層角度 ({localAngle}°)
            </Typography>
            <Slider
              min={0}
              max={360}
              value={localAngle}
              onChange={(_, val) => {
                if (typeof val === 'number') {
                  setLocalAngle(val);
                  debouncedUpdateGradient(localColorFrom, localColorTo, val);
                }
              }}
              valueLabelDisplay="auto"
              classes={{
                root: styles.sliderRoot,
                thumb: styles.sliderThumb,
                rail: styles.sliderRail,
                track: styles.sliderTrack,
                valueLabel: styles.sliderValueLabel,
              }}
            />
          </Box>
        </>
      ) : (
        <Box>
          <Typography variant="subtitle1" className={styles.subtitle}>
            單色顏色
          </Typography>
          <TechHexColorPicker
            color={localColorFrom}
            onChange={(color) => {
              setLocalColorFrom(color);
              debouncedUpdateSingleColor(color);
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ThemeSetting;
