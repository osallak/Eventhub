import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthData } from '../types/auth.types';

export const useAuth = (): AuthData => {
  console.log('🎣 useAuth hook called');
  const context = useContext(AuthContext);
  console.log('👤 Current auth context:', context);

  if (!context) {
    console.warn('⚠️ Auth context is undefined!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    initialized: !context.isLoading,
  };
};

export default useAuth;
