import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import {
  LogoIcon,
  TwitterIcon,
  GitHubIcon,
  FacebookIcon
} from './Icons.jsx';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    display: 'block',
    color: theme.palette.text.primary,
    fill: theme.palette.text.primary,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 14,
    padding: [theme.spacing.unit * 2, theme.spacing.unit * 4],
    [theme.breakpoints.down('sm')]: {
      padding: [theme.spacing.unit, theme.spacing.unit * 2]
    }
  },
  content: {
    padding: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
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
      <IconButton className={classes.button} aria-label="Twitter">
        <TwitterIcon className={classes.icon} aria-label="Twitter" />
      </IconButton>
      <IconButton className={classes.button} aria-label="GitHub">
        <GitHubIcon className={classes.icon} aria-label="GitHub" />
      </IconButton>
      <IconButton className={classes.button} aria-label="Facebook">
        <FacebookIcon className={classes.icon} aria-label="Facebook" />
      </IconButton>
    </div>
  </div>
);

export default withStyles(styles)(Footer);
