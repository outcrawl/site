import { Theme } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

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
    color: blue[500],
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

  img: {
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
  },

  table: {
    fontSize: 14,
    textAlign: 'left',
    borderSpacing: 0,
    borderCollapse: 'collapse',

    '& tr': {
      verticalAlign: 'middle',
    },
    '& th': {
      color: theme.palette.text.secondary,
      borderBottom: [[1, 'solid', theme.palette.divider]],
      padding: 8,
    },
    '& td': {
      borderBottom: [[1, 'solid', theme.palette.divider]],
      padding: 8,
    },
  },

  // Code
  code: {
    fontFamily: '"Roboto Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
    lineHeight: 1.6,
    fontSize: '0.875rem',
    display: 'inline-block',
    padding: '0 4px',
    backgroundColor: '#f7f7f7',
  },

  pre: {
    padding: 16,
    [theme.breakpoints.down('md')]: {
      padding: 10,
    },
  },

  '.code': {
    overflow: 'auto',
    margin: '1rem 0',
    backgroundColor: '#f7f7f7',

    '& pre': {
      backgroundColor: 'transparent',
      margin: 0,
      overflow: 'initial',
      float: 'left',
      minWidth: '100%',
    },

    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
      width: '100%',
      lineHeight: 1.5,
      fontSize: 14,
    },

    // Highlights
    '& .code__prompt': {
      color: 'rgba(0, 0, 0, 0.56)',
    },

    '& .code__line-highlight': {
      background: 'rgba(0, 0, 0, 0.08)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    '& .code__line-add': {
      background: 'rgba(0, 255, 0, 0.15)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    '& .code__line-remove': {
      background: 'rgba(255, 0, 0, 0.15)',
      display: 'block',
      marginRight: -16,
      marginLeft: -16,
      paddingRight: 16,
      paddingLeft: 16,
    },

    // Tokens
    '& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata': {
      color: '#008000',
    },

    '& .token.string': {
      color: '#a31515',
    },

    '& .token.punctuation, & .token.operator': {
      color: '#393a34',
    },

    '& .token.url, & .token.symbol, & .token.number, & .token.boolean, & .token.variable, & .token.constant, & .token.inserted': {
      color: '#36acaa',
    },

    '& .token.atrule, & .token.keyword, & .token.attr-value, & .code--autohotkey .token.selector, & .code--json .token.boolean, & .code--json .token.number, & code[class*="code--css"]': {
      color: '#0000ff',
    },

    '& .token.function': {
      color: '#393a34',
    },

    '& .token.deleted, & .code--autohotkey .token.tag': {
      color: '#9a050f',
    },

    '& .token.selector, & .code--autohotkey .token.keyword': {
      color: '#00009f',
    },

    '& .token.important, & .token.bold': {},

    '& .token.italic': {},

    '& .token.class-name, & .code--json .token.property': {
      color: '#2b91af',
    },

    '& .token.tag, & .token.selector': {
      color: '#800000',
    },

    '& .token.attr-name, & .token.property, & .token.regex, & .token.entity': {
      color: '#ff0000',
    },

    '& .token.directive.tag .tag': {
      background: '#ffff00',
      color: '#393a34',
    },
  },
});

export default globalStyles;
