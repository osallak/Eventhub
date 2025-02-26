import Posts from '@modules/posts/defs/api-routes';
import Uploads from '@modules/uploads/defs/api-routes';
import Users from '@modules/users/defs/api-routes';

export const API_ROUTES = {
  Auth: {
    Me: '/api/auth/me',
    Login: '/api/auth/login',
    Register: '/api/auth/register',
    Logout: '/api/auth/logout',
    RequestPasswordReset: '/api/auth/password/reset/request',
    ResetPassword: '/api/auth/password/reset',
  },
  Users,
  Uploads,
  Posts,
  Events: {
    Create: '/api/events',
    List: '/api/events',
  },
};

// For backward compatibility
const ApiRoutes = API_ROUTES;
export default ApiRoutes;
