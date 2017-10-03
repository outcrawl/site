import React from 'react';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';

import '../styles/index.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import lightTheme from '../utils/light-theme.js';

const styles = theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary
  },
  content: {
    minHeight: 'calc(100vh - 144px)'
  }
});

export default withStyles(styles)(({ classes, children, history }) => (
  <MuiThemeProvider theme={lightTheme}>
    <div className={classes.root}>
      <Header history={history} />
      <main className={classes.content}>
        {children()}
      </main>
      <Footer />
    </div>
  </MuiThemeProvider>
));
