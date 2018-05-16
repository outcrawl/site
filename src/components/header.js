import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import LogoText from '../assets/svg/logo-text.svg';

const styles = {
  root: {
    flexGrow: 1,
  },
  logo: {
    height: 30,
  },
};

const Header = ({ classes }) => (
  <AppBar className={classes.root} position="static" color="default">
    <Toolbar>
      <Link to="/">
        <LogoText className={classes.logo} />
      </Link>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Header);
