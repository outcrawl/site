import React from 'react';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';

import '../styles/index.scss';
import lightTheme from '../utils/light-theme.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

const styles = theme => ({
  root: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary
  },
  content: {
    minHeight: '100vh'
  }
});

const Index = props => {
  const classes = props.classes;
  return (
    <MuiThemeProvider theme={lightTheme}>
      <div className={classes.root}>
        <Header />
        <main className={classes.content}>
          {props.children()}
        </main>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(Index);
