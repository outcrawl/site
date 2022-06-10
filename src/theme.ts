import {
  Palette,
  Theme,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';
import { grey, lightBlue } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import { TypeBackground } from '@mui/material/styles/createPalette';
import { ThemeOptions } from '@mui/material/styles/createTheme';
import { GlobalStylesProps as StyledGlobalStylesProps } from '@mui/styled-engine/GlobalStyles/GlobalStyles';

export const CODE_FONT_FAMILY = [
  '"Roboto Mono"',
  'Consolas',
  '"Liberation Mono"',
  'Menlo',
  'Courier',
  'monospace',
].join(',');

type Modify<T, R> = Omit<T, keyof R> & R;

type OutcrawlPalette = Modify<
  Palette,
  {
    background?: {
      contrast: string;
    } & TypeBackground;
  }
>;

export type OutcrawlTheme = Modify<
  Theme,
  {
    palette: OutcrawlPalette;
  }
>;

const themeOptions = {
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: lightBlue['A400'],
    },
    background: {
      contrast: grey[200],
    },
  },
  typography: {
    h1: { fontWeight: 300 },
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
  },
};

const theme = responsiveFontSizes(
  createTheme(themeOptions as ThemeOptions),
) as OutcrawlTheme;

const globalStyles: StyledGlobalStylesProps<Theme>['styles'] = {
  '#__next': {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  'html,body': {
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
};

function useOutcrawlTheme(): OutcrawlTheme {
  return useTheme();
}

export { theme, useOutcrawlTheme, globalStyles };
