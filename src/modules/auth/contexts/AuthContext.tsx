import { createContext } from 'react';
import { AuthData } from '../types/auth.types';

const AuthContext = createContext<AuthData | null>(null);

export { AuthContext };
