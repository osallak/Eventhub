import Posts from '@modules/posts/defs/api-routes';
import Uploads from '@modules/uploads/defs/api-routes';
import Users from '@modules/users/defs/api-routes';

export const API_ROUTES = {
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
  Events: {
    Create: '/events',
    List: '/events',
  },
};

// For backward compatibility
const ApiRoutes = API_ROUTES;
export default ApiRoutes;
