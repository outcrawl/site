import React from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from 'material-ui/styles';
import grey from 'material-ui/colors/grey';
import lightBlue from 'material-ui/colors/lightBlue';
import Grid from 'material-ui/Grid';
import 'normalize.css';

import { getMeta } from '../utils/query';
import Header from '../components/header';
import Footer from '../components/footer';

const theme = createMuiTheme({});

const styles = (theme) => ({
  '@global': {
    html: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      boxSizing: 'border-box',
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
