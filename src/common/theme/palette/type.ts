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
};

export default CustomPalette;
