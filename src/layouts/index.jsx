import React from 'react';
import 'sanitize.css';
import { MuiThemeProvider } from 'material-ui/styles';

import lightTheme from '../utils/light-theme.js';
import Header from '../components/header';
import Footer from '../components/footer';

export default props => (
  <MuiThemeProvider theme={lightTheme}>
    <div>
      <Header />
      <main>
        {props.children()}
      </main>
      <Footer />
    </div>
  </MuiThemeProvider>
);
