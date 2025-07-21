import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/CloseOutlined';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export interface InfoItemProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  fullWidth?: boolean;
  extra?: React.ReactNode;
}

const InfoItem: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  fullWidth?: boolean;
  validate?: (val: string) => boolean;
  extra?: React.ReactNode;
}> = ({ label, value, onChange, fullWidth = false, validate, extra }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // 取消編輯
  const cancelEdit = () => {
    setTempValue(value);
    setError(null);
    setEditing(false);
  };

  // 儲存編輯（驗證）
  const saveEdit = () => {
    if (validate && !validate(tempValue)) {
      setError(`請輸入有效的${label}`);
      return;
    }
    setError(null);
    onChange(tempValue);
    setEditing(false);
  };

  // 快捷鍵支援
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(0,0,0,0.12)',
        pb: 1,
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        transition: 'background-color 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
        {label}
      </Typography>

      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
        {editing ? (
          <>
            <TextField
              inputRef={inputRef}
              size="small"
              variant="outlined"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              fullWidth={fullWidth}
              error={!!error}
              helperText={error}
              onKeyDown={handleKeyDown}
            />
            <Tooltip title="確認修改">
              <IconButton size="small" onClick={saveEdit} color={error ? 'error' : 'primary'}>
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="取消">
              <IconButton size="small" onClick={cancelEdit}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={value}
            >
              {value}
            </Typography>

            {/* 額外元件顯示區 */}
            {extra}

            <Tooltip title="編輯">
              <IconButton size="small" onClick={() => setEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
};

export default InfoItem;
