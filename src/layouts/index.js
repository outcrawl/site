import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';

import '../styles/main.scss';
import theme from '../utils/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';

const styles = theme => ({
  content: {
    minHeight: 'calc(100vh - 144px)',
  },
});

export default withStyles(styles)(({ children, history, classes }) => (
  <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
    <div>
      <Header history={history} />
      <main className={classes.content}>
        {children()}
      </main>
      <Footer />
    </div>
  </MuiThemeProvider>
));
