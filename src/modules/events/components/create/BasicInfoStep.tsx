import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EventFormData } from '../../types/form';
import { categories } from '../../../../constants/categories';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { getInputStyles } from './styles/inputStyles';

interface BasicInfoStepProps {
  formData: EventFormData;
  onFormChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationErrors {
  title?: string;
  category?: string;
}

export const BasicInfoStep = ({
  formData,
  onFormChange,
  onValidationChange,
}: BasicInfoStepProps) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const inputStyles = getInputStyles(theme);

  const validateField = (field: keyof ValidationErrors, value: string | undefined) => {
    switch (field) {
      case 'title':
        if (!value?.trim()) {
          return t('Title is required');
        }
        if (value.trim().length < 3) {
          return t('Title must be at least 3 characters');
        }
        break;
      case 'category':
        if (!value) {
          return t('Please select a category');
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate title
    const titleError = validateField('title', formData.title);
    if (titleError) {
      newErrors.title = titleError;
      isValid = false;
    }

    // Validate category
    const categoryError = validateField('category', formData.category);
    if (categoryError) {
      newErrors.category = categoryError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      title: true,
      category: true,
    });

    return isValid;
  };

  const handleBlur = (field: keyof EventFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field as keyof ValidationErrors, formData[field] as string);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    onFormChange(field, value);
    if (touched[field]) {
      const error = validateField(field as keyof ValidationErrors, value as string);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  // Validate form when mounted and when form data changes
  useEffect(() => {
    const isValid = validateForm();
    onValidationChange(isValid);
  }, [formData.title, formData.category]);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('Event Title')}
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            error={!!errors.title}
            helperText={errors.title}
            required
            sx={{
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'divider',
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.category}>
            <InputLabel required>{t('Category')}</InputLabel>
            <Select
              value={formData.category || ''}
              label={t('Category')}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category.toLowerCase()} value={category.toLowerCase()}>
                  {t(category)}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('Description')}
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            sx={{
              ...inputStyles,
              '& .MuiOutlinedInput-root': {
                height: 'auto',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
