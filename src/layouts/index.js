import React from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import 'normalize.css';

import { getMeta } from '../utils/query';
import Header from '../components/header';
import Footer from '../components/footer';

const theme = createMuiTheme({
  typography: {
    htmlFontSize: 16,
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: blue[500],
    },
  },
});

const styles = (theme) => ({
  '@global': {
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
      outline: ['none', '!important'],
    },
    '::moz-focus-inner': {
      border: [0, '!important'],
    },

    // Headings
    h1: {
      fontSize: '3.5rem',
      margin: '0.7em 0 0.5em',
      fontWeight: 300,
      letterSpacing: '-.04em',
      lineHeight: '1.14286em',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    h2: {
      fontSize: '2.75rem',
      margin: '0.7em 0 0.4em',
      fontWeight: 400,
      letterSpacing: '-.02em',
      lineHeight: '1.30357em',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    h3: {
      fontSize: '2rem',
      margin: '0.7em 0 0.4em',
      fontWeight: 400,
      lineHeight: '1.06667em',
      color: 'rgba(0, 0, 0, 0.54)',
    },
    h4: {
      fontSize: '1.5rem',
      margin: '0.6em 0',
      fontWeight: 400,
      lineHeight: '1.20588em',
      color: 'rgba(0, 0, 0, 0.54)',
    },

    // Text
    'p, ul, ol': {
      lineHeight: 1.6,
      margin: '1rem 0',
    },
    a: {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },

    img: {
      maxWidth: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
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
  },
  main: {
    backgroundColor: theme.palette.background.paper,
  },
});

const IndexLayout = withStyles(styles)(({ children, classes, meta }) => (
  <div>
    <Header meta={meta} />
    <main className={classes.main}>{children()}</main>
    <Footer meta={meta} />
  </div>
));

const Wrapper = ({ children, data }) => {
  const meta = getMeta(data);

  return (
    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
      <IndexLayout children={children} meta={meta} />
    </MuiThemeProvider>
  );
};

export default Wrapper;

export const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;
