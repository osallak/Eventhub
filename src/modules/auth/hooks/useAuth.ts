import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthData } from '../types/auth.types';

export const useAuth = (): AuthData => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    initialized: !context.isLoading,
  };
};

export default useAuth;
