import { useContext } from 'react';
import { ThemeContext } from '../components/ThemeContext';

// Este es el hook que usaremos en otros componentes para acceder al tema.
export const useTheme = () => useContext(ThemeContext);