export const Routes = {
  Auth: {
    Login: '/auth/login',
    Register: '/auth/register',
    ForgotPassword: '/auth/forgot-password',
    ResetPassword: '/auth/reset-password',
  },
  Common: {
    Home: '/',
    Events: '/events',
    Profile: '/profile',
  },
} as const;
