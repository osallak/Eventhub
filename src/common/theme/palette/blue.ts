import CustomPalette from '@common/theme/palette/type';
import { alpha } from '@mui/material/styles';

const GREY = {
  50: '#FAFAFA',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
  A100: '#F5F5F5',
  A200: '#EEEEEE',
  A400: '#BDBDBD',
  A700: '#616161',
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
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
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
    focus: alpha(GREY[500], 0.12),
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
    },
  },
};

export default palette;
