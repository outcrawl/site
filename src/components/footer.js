import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

const styles = (theme) => ({
  root: {
    maxWidth: theme.spacing.unit * 110,
    margin: 'auto',
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 2}px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 2}px`,
    },
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: 'none',
  },
  listItem: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  copyright: {
    marginTop: theme.spacing.unit,
    color: theme.palette.text.secondary,
  },
});

const Footer = ({ classes, meta }) => (
  <footer className={classes.root}>
    <Typography variant="title" gutterBottom>
      Outcrawl
    </Typography>
    <Typography variant="subheading" component="div">
      <Grid container>
        <Grid item xs={12} sm={6}>
          <ul className={classes.list}>
            <li className={classes.listItem}>
              <a href="https://github.com/tinrab">GitHub</a>
            </li>
            <li className={classes.listItem}>
              <a href="https://twitter.com/tinrab">Twitter</a>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ul className={classes.list}>
            <li className={classes.listItem}>
              <Link to="/about">About</Link>
            </li>
            <li className={classes.listItem}>
              <Link to="/privacy">Privacy</Link>
            </li>
          </ul>
        </Grid>
      </Grid>
    </Typography>
    <Typography className={classes.copyright}>
      2018 &copy; {meta.site.title}. All rights reserved.
    </Typography>
  </footer>
);

export default withStyles(styles)(Footer);
