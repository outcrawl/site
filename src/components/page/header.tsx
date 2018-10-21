import * as React from 'react';
import {
  AppBar, createStyles, Toolbar, withStyles,
} from '@material-ui/core';
import { Link } from 'gatsby';

import { LogoText } from '../../assets';

const styles = () => createStyles({
  root: {
    flexGrow: 1,
  },
  logo: {
    height: 30,
  },
});

interface HeaderProps {
  classes?: {
    root: string;
    logo: string;
  }
}

class Header extends React.PureComponent<HeaderProps> {
  public render() {
    const { classes } = this.props;

    return (
      <AppBar className={classes.root} position="static" color="default">
        <Toolbar>
          <Link to="/" className={classes.logo}>
            <LogoText className={classes.logo}/>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
