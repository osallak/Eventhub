import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LoginFormData } from '../types/auth.types';
import { Routes } from '@common/constants/routes';
import useAuth from '../hooks/api/useAuth';
import { useSnackbar } from 'notistack';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const response = await auth.login(data, {
        displayProgress: true,
        displaySuccess: true,
      });

      if (response.success && response.data?.status === 'success') {
        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Show success message
        enqueueSnackbar(response.data.message, {
          variant: 'success',
        });

        // Redirect to home
        window.location.href = '/';
      } else if (response.errors?.length) {
        setError(response.errors[0]);
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(t('auth.errors.login_failed'));
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          {t('auth.login.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('auth.login.subtitle')}
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
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
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...register('password', {
              required: t('auth.validation.password_required'),
            })}
          />

          <FormControlLabel
            control={<Checkbox {...register('remember')} />}
            label={t('auth.login.remember_me')}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.2 }}
          >
            {t('auth.login.submit')}
          </Button>

          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} sx={{ py: 1.2 }}>
            {t('auth.login.google')}
          </Button>
        </Stack>
      </form>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          {t('auth.login.no_account')}{' '}
          <Typography
            component="a"
            href={Routes.Auth.Register}
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            {t('auth.login.register_link')}
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
};
