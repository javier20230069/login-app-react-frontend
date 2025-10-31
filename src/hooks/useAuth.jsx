import { useContext } from 'react';
import { AuthContext } from '../context/auth-context.js';

// Este es el hook personalizado
export const useAuth = () => {
  return useContext(AuthContext);
};