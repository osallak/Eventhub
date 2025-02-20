import Posts from '@modules/posts/defs/api-routes';
import Uploads from '@modules/uploads/defs/api-routes';
import Users from '@modules/users/defs/api-routes';

const ApiRoutes = {
  Auth: {
    Me: '/auth/me', // This should be a GET request
    Login: '/auth/login',
    Register: '/auth/register',
    Logout: '/auth/logout',
    RequestPasswordReset: '/auth/password/reset/request',
    ResetPassword: '/auth/password/reset',
  },
  Users,
  Uploads,
  Posts,
};

export default ApiRoutes;
