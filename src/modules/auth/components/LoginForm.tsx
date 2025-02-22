import { Routes } from '@common/constants/routes';
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import { LoginFormData } from '../types/auth.types';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const returnUrl = router.query.returnUrl || router.query.redirect;

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      const response = await auth.login(data, {
        displayProgress: true,
        displaySuccess: false,
      });

      if (response.success) {
        enqueueSnackbar('Successfully logged in', {
          variant: 'success',
          autoHideDuration: 3000,
        });

        // Check both redirect and returnUrl parameters
        const redirectPath = router.query.redirect || router.query.returnUrl;

        if (redirectPath && typeof redirectPath === 'string') {
          const decodedPath = decodeURIComponent(redirectPath);

          await router.push(decodedPath);
        } else {
          await router.push(Routes.Common.Home);
        }
      } else {
        setError(response.errors?.[0] || 'An error occurred during login');
      }
    } catch (err: unknown) {
      setError('An error occurred during login');
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Login to your account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Login to your account to continue
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Email"
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
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
              required: 'Password is required',
            })}
          />

          <FormControlLabel control={<Checkbox {...register('remember')} />} label="Remember me" />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.2 }}
          >
            Login
          </Button>

          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} sx={{ py: 1.2 }}>
            Login with Google
          </Button>
        </Stack>
      </form>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Don't have an account?{' '}
          <Typography
            component={Link}
            href={`${Routes.Auth.Register}${returnUrl ? `?returnUrl=${returnUrl}` : ''}`}
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            Create an account
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
};
