import CustomPalette from '@common/theme/palette/type';
import { alpha } from '@mui/material/styles';

const GREY = {
  0: '#FFFFFF',
  50: '#F9FAFB',
  100: '#F2F2F2',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  A100: '#D0D7DC',
  A200: '#A1AEBD',
  A400: '#657487',
  A700: '#455463',
};

const PRIMARY = {
  lighter: '#E3F2FD',
  light: '#90CAF9',
  main: '#2196F3',
  dark: '#1976D2',
  darker: '#0D47A1',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#F3E5F5',
  light: '#CE93D8',
  main: '#9C27B0',
  dark: '#7B1FA2',
  darker: '#4A148C',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#E1F5FE',
  light: '#4FC3F7',
  main: '#03A9F4',
  dark: '#0288D1',
  darker: '#01579B',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#E8F5E9',
  light: '#81C784',
  main: '#4CAF50',
  dark: '#388E3C',
  darker: '#1B5E20',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FFF3E0',
  light: '#FFB74D',
  main: '#FF9800',
  dark: '#F57C00',
  darker: '#E65100',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFEBEE',
  light: '#EF9A9A',
  main: '#F44336',
  dark: '#D32F2F',
  darker: '#B71C1C',
  contrastText: '#FFFFFF',
};

const palette: CustomPalette = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: GREY[800],
    secondary: GREY[600],
    disabled: GREY[500],
  },
  background: {
    paper: '#fff',
    default: GREY[100],
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
