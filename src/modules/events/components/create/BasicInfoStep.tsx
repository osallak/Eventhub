import {
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { getInputStyles } from './styles/inputStyles';
import { EVENT_CATEGORIES } from '@modules/events/types/categories';
import { EventFormData } from '@modules/events/types/form';

interface BasicInfoStepProps {
  formData: EventFormData;
  onFormChange: <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface ValidationErrors {
  title?: string;
  category?: string;
  description?: string;
}

const capitalizeFirstLetter = (str: string | undefined) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const BasicInfoStep = ({
  formData,
  onFormChange,
  onValidationChange,
}: BasicInfoStepProps) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const theme = useTheme();
  const inputStyles = getInputStyles(theme);

  const validateField = (field: keyof ValidationErrors, value: string | undefined) => {
    switch (field) {
      case 'title':
        if (!value?.trim()) {
          return 'Title is required';
        }
        if (value.trim().length < 3) {
          return 'Title must be at least 3 characters';
        }
        break;
      case 'category':
        if (!value) {
          return 'Please select a category';
        }
        break;
      case 'description':
        if (!value?.trim()) {
          return 'Description is required';
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

    // Validate description
    const descriptionError = validateField('description', formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      title: true,
      category: true,
      description: true,
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
  }, [formData.title, formData.category, formData.description]);

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Title"
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
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category || ''}
              label="Category"
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              sx={inputStyles}
            >
              {[
                { label: 'Sports', value: EVENT_CATEGORIES.SPORTS },
                { label: 'Music', value: EVENT_CATEGORIES.MUSIC },
                { label: 'Tech', value: EVENT_CATEGORIES.TECH },
                { label: 'Business', value: EVENT_CATEGORIES.BUSINESS },
                { label: 'Art', value: EVENT_CATEGORIES.ART },
                { label: 'Food', value: EVENT_CATEGORIES.FOOD },
                { label: 'Other', value: EVENT_CATEGORIES.OTHER },
              ].map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {capitalizeFirstLetter(category.value)}
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
            label="Description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            error={!!errors.description}
            helperText={errors.description}
            required
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
    </Stack>
  );
};
