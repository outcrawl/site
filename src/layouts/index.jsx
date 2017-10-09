import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles';

import '../styles/main.scss';

import theme from '../utils/theme.js';
import withStyles from '../components/ui/withStyles';
import Header from '../components/Header';
import Footer from '../components/Footer';

const styles = theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary
  },
  content: {
    minHeight: 'calc(100vh - 144px)'
  }
});

export default withStyles(styles)(({ children, history, classes }) => (
  <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
    <div className={classes.root}>
      <Header history={history} />
      <main className={classes.content}>
        {children()}
      </main>
      <Footer />
    </div>
  </MuiThemeProvider>
));
