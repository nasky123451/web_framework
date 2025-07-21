import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  Box,
  Avatar,
  IconButton,
  Typography,
  Button,
  Tooltip,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import EditableText from './User/EditableText';
import SlideGrowTransition from './User/SlideGrowTransition';
import InfoItem from './User/InfoItem';
import { styled } from '@mui/material/styles';
import {
    SortableDynamicField,
    SortableCustomField,
    handleDragEnd,
    DynamicField,
    CustomField,
  } from './User/FieldSortables';
import { useThemeContext, getColorCss } from '../../../context/ThemeContext';
import robot from '../../../image/15644664-fe18-4f90-9a6d-7286ee87ebe8.15644664-fe17-4af9-86a8-90c6e7b27621.jpeg';

interface CustomField {
  id: number;
  label: string;
  value: string;
}

interface DynamicField {
    key: string;
    label: string;
    value: string;
    type?: string;
  }

export interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  border: '6px solid white',
  boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
  borderRadius: 18,
  backgroundColor: '#fff',
}));

const daysUntilBirthday = (birthday: string) => {
  const now = new Date();
  const bday = new Date(birthday);
  if (isNaN(bday.getTime())) return null;

  let next = new Date(now.getFullYear(), bday.getMonth(), bday.getDate());
  if (next < now) next.setFullYear(next.getFullYear() + 1);
  const diff = next.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onClose }) => {
  const { themeColors } = useThemeContext();

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);

  // sensors
  const sensors = useSensors(useSensor(PointerSensor));
  const [titleInfo, setTitleInfo] = useState({
    name: '林君翰',
    id: 'A123456789',
  });

  useEffect(() => {
    const fieldsFromBackend: DynamicField[] = [
      { key: 'gender', label: '性別', value: '男' },
      { key: 'birthday', label: '生日', value: '1990-05-21' },
      { key: 'phone', label: '電話', value: '0912-345-678' },
      { key: 'email', label: '信箱', value: 'junhan@example.com' },
      { key: 'address', label: '地址', value: '台北市中山區中山北路一段123號' },
    ];
  
    setDynamicFields(fieldsFromBackend);
  }, []);

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // 監控是否有未儲存變更
  useEffect(() => {
    setUnsavedChanges(true);
  }, [dynamicFields, titleInfo, customFields]);

  // 處理欄位變更
  const handleFieldChange = (key: string, value: string) => {
    setDynamicFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    );
  };

  const handleTitleChange = (key: 'name' | 'id', value: string) => {
    setTitleInfo((prev) => ({ ...prev, [key]: value }));
  };

  // 新增自訂欄位
  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now(),  // 你之前 id 用 number
      label: '新欄位',
      value: '',
    };
    setCustomFields((prev) => [...prev, newField]);
  };

  // 修改自訂欄位
  const handleCustomFieldChange = (id: number, value: string) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  };

  // 刪除自訂欄位
  const removeCustomField = (id: number) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  // 儲存動作
  const handleSave = () => {
    setSaving(true);
  
    try {
      // 把 customFields 轉成 DynamicField 格式並合併到 dynamicFields
      const newDynamicFields = [
        ...dynamicFields,
        ...customFields.map(({ id, label, value }) => ({
          key: `custom_${id}`,  // 這邊用 id 產生唯一 key
          label,
          value,
        })),
      ];
  
      // 模擬儲存動作（或改成真正的 API 呼叫）
      console.log("儲存的 dynamicFields:", newDynamicFields);
  
      // 更新 state，清空 customFields
      setDynamicFields(newDynamicFields);
      setCustomFields([]);
  
      setUnsavedChanges(false);
    } finally {
      setSaving(false);
    }
  };

  // 關閉前確認
  const handleClose = () => {
    if (unsavedChanges) {
      if (!window.confirm('您有未儲存的修改，確定要關閉嗎？')) return;
    }
    onClose();
  };

  const handleCustomFieldLabelChange = (id: number, label: string) => {
    setCustomFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label } : f))
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideGrowTransition}
      keepMounted
      maxWidth="md"
      fullWidth
      aria-labelledby="user-profile-dialog"
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: getColorCss(themeColors.box),
          color: getColorCss(themeColors.text),
          p: 3,
          borderRadius: 2,
          overflow: 'hidden',
          userSelect: saving ? 'none' : 'auto',
          pointerEvents: saving ? 'none' : 'auto',
          minHeight: '480px',
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
          aria-label="關閉"
          disabled={saving}
        >
          <CloseIcon />
        </IconButton>
  
        {/* Left side: avatar and title */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '200px 1fr' }}
          gap={4}
          alignItems="start"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            sx={{ userSelect: 'none' }}
          >
            <LargeAvatar src={robot} />
            <EditableText
              value={titleInfo.name}
              onChange={(v) => handleTitleChange('name', v)}
              variant="h5"
              bold
              disabled={saving}
            />
            <EditableText
              value={`編號：${titleInfo.id}`}
              onChange={(v) => {
                const idOnly = v.replace(/^編號：/, '');
                handleTitleChange('id', idOnly);
              }}
              variant="subtitle1"
              color="text.secondary"
              disabled={saving}
            />
          </Box>
  
          {/* Right side: info fields */}
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
          {dynamicFields.map(({ key, label, value }) => {
            const isBirthday = key === 'birthday';
            const days = isBirthday ? daysUntilBirthday(value) : null;

            return (
                <Box key={key} gridColumn={key === 'address' ? 'span 2' : undefined}>
                <InfoItem
                    label={label}
                    value={value}
                    onChange={(v) => handleFieldChange(key, v)}
                    validate={(v) => {
                    if (key === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                    if (key === 'phone') return /^[\d\-+() ]{7,20}$/.test(v);
                    if (key === 'birthday') return !isNaN(new Date(v).getTime());
                    return v.length > 0;
                    }}
                    fullWidth={key === 'address'}
                    extra={
                    isBirthday && days != null ? (
                        <Tooltip title={`距離生日還有 ${days} 天`}>
                        <InfoIcon color={days <= 7 ? 'warning' : 'info'} />
                        </Tooltip>
                    ) : undefined
                    }
                />
                </Box>
            );
            })}
  
            {/* 自訂欄位區塊 */}
            {customFields.map(({ id, label, value }) => (
                <Box
                    key={id}
                    gridColumn={customFields.length === 1 ? 'span 2' : undefined}
                    sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderBottom: '1px solid rgba(0,0,0,0.12)',
                    pb: 1,
                    }}
                >
                    {/* Label 編輯輸入框 */}
                    <TextField
                    size="small"
                    label="欄位名稱"
                    value={label}
                    onChange={(e) => handleCustomFieldLabelChange(id, e.target.value)}
                    fullWidth
                    sx={{ mb: 0.5 }}
                    disabled={saving}
                    />

                    {/* Value 編輯輸入框 + 刪除按鈕 */}
                    <Box display="flex" gap={1} mt={0.5} alignItems="center">
                    <TextField
                        size="small"
                        value={value}
                        onChange={(e) => handleCustomFieldChange(id, e.target.value)}
                        fullWidth
                        disabled={saving}
                    />
                    <Tooltip title="刪除欄位">
                        <IconButton onClick={() => removeCustomField(id)} size="small" color="error" disabled={saving}>
                        <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    </Box>
                </Box>
                ))}
  
            {/* 新增自訂欄位按鈕 */}
            <Box gridColumn="span 2" textAlign="right" mt={1} display="flex" justifyContent="space-between">
                <Button variant="outlined" size="small" onClick={addCustomField}>
                    + 新增自訂欄位
                </Button>
            </Box>
          </Box>
        </Box>
  
        {/* 儲存區塊 */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            mt: 3,
            pt: 2,
            borderTop: '1px solid rgba(0,0,0,0.12)',
            backgroundColor: getColorCss(themeColors.box),
            textAlign: 'right',
            zIndex: 5,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!unsavedChanges || saving}
            color={unsavedChanges ? 'primary' : 'inherit'}
          >
            {saving ? '儲存中...' : '儲存'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserProfileDialog;
