import { Palette, TypeAction } from '@mui/material';

type CustomPalette = Omit<
  Palette,
  'mode' | 'augmentColor' | 'contrastThreshold' | 'tonalOffset' | 'getContrastText' | 'action'
> & {
  mode: 'light' | 'dark';
  action: Omit<TypeAction, 'selectedOpacity' | 'focusOpacity' | 'activatedOpacity'> & {
    hoverOpacity: number;
    disabledOpacity: number;
  };
  background: {
    paper: string;
    default: string;
    neutral: string;
  };
  dark: {
    background: {
      paper: string;
      default: string;
      neutral: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    action: {
      active: string;
      hover: string;
      selected: string;
      disabled: string;
      disabledBackground: string;
    };
  };
};

export default CustomPalette;
