import CustomPalette from '@common/theme/palette/type';
import { alpha } from '@mui/material/styles';

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#C8FAD6',
  light: '#5BE49B',
  main: '#00A76F',
  dark: '#007867',
  darker: '#004B50',
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
  mode: 'light',
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
    paper: '#FFFFFF',
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
  dark: {
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    text: {
      primary: '#FFFFFF',
      secondary: GREY[400],
      disabled: GREY[600],
    },
    action: {
      active: GREY[400],
      hover: alpha(GREY[400], 0.08),
      selected: alpha(GREY[400], 0.16),
      disabled: alpha(GREY[400], 0.8),
      disabledBackground: alpha(GREY[400], 0.24),
      focus: alpha(GREY[400], 0.24),
    },
  },
};

export default palette;
