import React, { useState, useEffect } from 'react';
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
import styles from './ThemeSetting.module.css'; // <-- 引用 CSS Module

type ThemeParts = 'sidebar' | 'topbar' | 'box' | 'text' | 'background';

const ThemeSetting: React.FC = () => {
  const { themeColors, setThemeColors } = useThemeContext();

  const [selectedPart, setSelectedPart] = useState<ThemeParts>('sidebar');
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [colorFrom, setColorFrom] = useState('#1976d2');
  const [colorTo, setColorTo] = useState('#42a5f5');
  const [angle, setAngle] = useState(90);

  useEffect(() => {
    const part = themeColors[selectedPart];
    if (!part) return;

    const gradient = part.gradient;

    if (gradient?.enabled && gradient.stops?.length >= 2) {
      setGradientEnabled(true);
      setColorFrom(gradient.stops[0].color);
      setColorTo(gradient.stops[1].color);
      setAngle(gradient.angle || 90);
    } else {
      setGradientEnabled(false);
      setColorFrom(part.color || '#1976d2');
      setColorTo(part.color || '#42a5f5');
      setAngle(90);
    }
  }, [selectedPart, themeColors]);

  const updateGradient = (newFrom: string, newTo: string, newAngle: number) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
        color: newFrom,
        gradient: {
          enabled: true,
          from: newFrom,
          to: newTo,
          angle: newAngle,
          stops: [
            { offset: 0, color: newFrom },
            { offset: 1, color: newTo },
          ],
        },
      },
    }));
  };

  const updateSingleColor = (newColor: string) => {
    setThemeColors((prev) => ({
      ...prev,
      [selectedPart]: {
        color: newColor,
        gradient: {
          enabled: false,
          from: newColor,
          to: newColor,
          angle: 90,
          stops: [
            { offset: 0, color: newColor },
            { offset: 1, color: newColor },
          ],
        },
      },
    }));
  };

  useEffect(() => {
    Cookies.set('themeColors', JSON.stringify(themeColors), { expires: 365 });
  }, [themeColors]);

  const toggleGradient = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    setGradientEnabled(enabled);

    if (enabled) {
      updateGradient(colorFrom, colorTo, angle);
    } else {
      updateSingleColor(colorFrom);
    }
  };

  const onSingleColorChange = (color: string) => {
    setColorFrom(color);
    updateSingleColor(color);
  };

  const onGradientFromChange = (color: string) => {
    setColorFrom(color);
    updateGradient(color, colorTo, angle);
  };

  const onGradientToChange = (color: string) => {
    setColorTo(color);
    updateGradient(colorFrom, color, angle);
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
          sx={{ color: '#00ffe1', fontFamily: "'Orbitron', sans-serif" }}
          value={selectedPart}
          label="調整項目"
          onChange={(e) => setSelectedPart(e.target.value as ThemeParts)}
          classes={{
            root: styles.selectRoot,
            outlined: styles.selectOutlined,
            icon: styles.selectIcon,
          }}
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
            <TechHexColorPicker color={colorFrom} onChange={onGradientFromChange} />
          </Box>

          <Box>
            <Typography variant="subtitle1" className={styles.subtitle}>
              漸層結束色
            </Typography>
            <TechHexColorPicker color={colorTo} onChange={onGradientToChange} />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" className={styles.subtitle}>
              漸層角度 ({angle}°)
            </Typography>
            <Slider
              min={0}
              max={360}
              value={angle}
              onChange={(_, val) => {
                if (typeof val === 'number') {
                  setAngle(val);
                  updateGradient(colorFrom, colorTo, val);
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
          <TechHexColorPicker color={colorFrom} onChange={onSingleColorChange} />
        </Box>
      )}
    </Box>
  );
};

export default ThemeSetting;
