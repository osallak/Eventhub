export const PERMISSIONS = {
  Events: {
    Create: 'auth',
    Join: 'auth',
    Edit: 'auth',
    View: 'public',
    List: 'public',
  },
  Profile: {
    View: 'auth',
    Edit: 'auth',
  },
} as const;
