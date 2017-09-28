import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';

import {
  LogoIcon,
} from './Icons.jsx';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    display: 'block',
    color: theme.palette.text.secondary,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    height: 80,
    padding: [0, theme.spacing.unit * 4],
    [theme.breakpoints.down('sm')]: {
      height: 64,
      padding: [0, theme.spacing.unit * 2]
    }
  },
  content: {
    padding: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 16,
    fill: theme.palette.text.primary
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    marginRight: 10
  }
});

const Footer = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.content}>
      <LogoIcon className={classes.logo} />
      <Link className={classes.link} to="about">About</Link>
      <Link className={classes.link} to="privacy">Privacy</Link>
    </div>
    <div className={classes.content}>
      <a className={classes.link} href="https://twitter.com/tinrab">Twitter</a>
      <a className={classes.link} href="https://github.com/tinrab">GitHub</a>
      <a className={classes.link} href="https://www.facebook.com/outcrawl">Facebook</a>
    </div>
  </div>
);

export default withStyles(styles)(Footer);
