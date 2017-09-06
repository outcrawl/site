import React from 'react';
import { MuiThemeProvider } from 'material-ui/styles';
import 'sanitize.css';

import lightTheme from '../utils/light-theme.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
