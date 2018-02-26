import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';

import {
  LogoIcon,
  TwitterIcon,
  GitHubIcon,
  FacebookIcon,
} from './Icons';

const styles = theme => ({
  root: {
    backgroundColor: '#f5f5f5',
    color: theme.palette.text.secondary,
    fontSize: 14,
    padding: '16px 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '16px',
    },
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
    fill: theme.palette.text.secondary,
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    marginRight: 8,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  social: {
    justifyContent: 'flex-end',
  }
});

export default withStyles(styles)(({ classes }) => (
  <Grid container spacing={0} className={classes.root}>
    <Grid item xs={12} sm={6} className={classes.content}>
      <LogoIcon className={classes.logo} />
      <Link className={classes.link} to="/about/">About</Link>
      <Link className={classes.link} to="/privacy/">Privacy</Link>
    </Grid>
    <Grid item xs={12} sm={6} className={`${classes.content} ${classes.social}`}>
      <IconButton href="https://twitter.com/tinrab" aria-label="Find us on Twitter">
        <TwitterIcon />
      </IconButton>
      <IconButton href="https://github.com/tinrab" aria-label="Find us on GitHub">
        <GitHubIcon />
      </IconButton>
      <IconButton href="https://www.facebook.com/outcrawl" aria-label="Find us on Facebook">
        <FacebookIcon />
      </IconButton>
    </Grid>
  </Grid>
));
