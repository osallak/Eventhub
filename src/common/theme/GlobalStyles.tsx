import { GlobalStyles as MUIGlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function GlobalStyles() {
  const theme = useTheme();
  return (
    <MUIGlobalStyles
      styles={{
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
        },
        '#__next': {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        ul: {
          margin: 0,
          padding: 0,
        },
        a: {
          textDecoration: 'none',
          color: theme.palette.primary.main,
        },
      }}
    />
  );
}
