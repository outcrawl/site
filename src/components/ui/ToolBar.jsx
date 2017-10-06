import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

export default ({ children, className }) => (
  <AppBar position="static" elevation={0} square={true} className={className}>
    <Toolbar>
      {children}
    </Toolbar>
  </AppBar>
);
