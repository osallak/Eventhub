import { useTheme } from '@common/contexts/ThemeContext';
import { Routes } from '@common/constants/routes';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RegisterCredentials } from '../types/auth.types';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>();

  const password = watch('password');

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      setError(null);
      // TODO: Implement register logic
      console.log(data);
    } catch (err) {
      setError(t('auth.errors.register_failed'));
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          {t('auth.register.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('auth.register.subtitle')}
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label={t('auth.fields.name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', {
              required: t('auth.validation.name_required'),
              minLength: {
                value: 2,
                message: t('auth.validation.name_min_length'),
              },
            })}
          />

          <TextField
            fullWidth
            label={t('auth.fields.email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: t('auth.validation.email_required'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('auth.validation.email_invalid'),
              },
            })}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label={t('auth.fields.password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: t('auth.validation.password_required'),
              minLength: {
                value: 8,
                message: t('auth.validation.password_min_length'),
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: t('auth.validation.password_pattern'),
              },
            })}
          />

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label={t('auth.fields.confirm_password')}
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password_confirmation', {
              required: t('auth.validation.confirm_password_required'),
              validate: (value) =>
                value === password || t('auth.validation.passwords_must_match'),
            })}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.2 }}
          >
            {t('auth.register.submit')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            sx={{ py: 1.2 }}
          >
            {t('auth.register.google')}
          </Button>
        </Stack>
      </form>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {t('auth.register.have_account')}{' '}
          <Typography
            component="a"
            href={Routes.Auth.Login}
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            {t('auth.register.login_link')}
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
};
