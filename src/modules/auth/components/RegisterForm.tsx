import { Routes } from '@common/constants/routes';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/api/useAuth';
import { RegisterInput } from '../types/auth.types';

export const RegisterForm: React.FC = () => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>();

  const password = watch('password');

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);

      const response = await auth.register(data, {
        displayProgress: true,
        displaySuccess: false,
      });

      if (response.success) {
        enqueueSnackbar('Successfully registered', {
          variant: 'success',
          autoHideDuration: 3000,
        });

        // Check both redirect and returnUrl parameters
        const redirectPath = router.query.redirect || router.query.returnUrl;

        if (redirectPath && typeof redirectPath === 'string') {
          const decodedPath = decodeURIComponent(redirectPath);
          console.log('Redirecting to:', decodedPath);
          await router.push(decodedPath);
        } else {
          console.log('No redirect path, going to home');
          await router.push(Routes.Common.Home);
        }
      } else {
        setError(response.errors?.[0] || 'An error occurred during registration');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError('An error occurred during registration');
    }
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Create an Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join us to start creating and discovering events
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Full Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

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
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
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
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords must match',
            })}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.2 }}
          >
            Create Account
          </Button>

          <Button variant="outlined" size="large" startIcon={<GoogleIcon />} sx={{ py: 1.2 }}>
            Sign up with Google
          </Button>
        </Stack>
      </form>

      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Typography
            component={Link}
            href={Routes.Auth.Login}
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', fontWeight: 500 }}
          >
            Sign in
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
};
