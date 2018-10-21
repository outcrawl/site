import { Theme } from '@material-ui/core';

const globalStyles = (theme: Theme): any => ({
  html: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    boxSizing: 'border-box',
    fontSize: 16,
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
  },
  body: {
    backgroundColor: theme.palette.background.default,
  },
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  ':focus': {
    outline: 'none !important',
  },
  '::moz-focus-inner': {
    border: '0, !important',
  },

  h1: {
    ...theme.typography.h2,
  },
  h2: {
    ...theme.typography.h3,
  },
  h3: {
    ...theme.typography.h4,
  },
  h4: {
    ...theme.typography.h5,
  },
  h5: {
    ...theme.typography.h6,
  },

  a: {
    ...theme.typography.body1,
    color: theme.palette.secondary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    fontSize: '1rem',
  },
  p: {
    ...theme.typography.body1,
    fontSize: '1rem',
  },
});

export default globalStyles;
