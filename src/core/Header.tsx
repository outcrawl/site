import { AppBar, createStyles, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import React from 'react';
import LogoText from '../assets/LogoText';

const useStyles = makeStyles(createStyles({
  root: {
    flexGrow: 1,
  },
  logo: {
    height: 30,
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} position="static" color="default">
      <Toolbar>
        <Link className={classes.logo} to="/">
          <LogoText className={classes.logo}/>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
