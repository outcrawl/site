import React from 'react';
import Link from 'gatsby-link';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import Author from './Author';

const styles = theme => ({
  root: {
    width: '100%',
    height: 250,
    boxSizing: 'border-box',
    position: 'relative',
    padding: theme.spacing.unit,
    [theme.breakpoints.up('xl')]: {
      height: 350
    }
  },
  paper: {
    position: 'absolute',
    top: theme.spacing.unit,
    right: theme.spacing.unit,
    bottom: theme.spacing.unit,
    left: theme.spacing.unit,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing.unit * 2,
    background: 'linear-gradient(0, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.3) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  title: {
    color: theme.palette.shades.dark.text.primary,
    fontWeight: 400,
    margin: 0,
    paddingBottom: theme.spacing.unit * 2,
    textDecoration: 'none',
    fontSize: 24,
    lineHeight: 1.25,
    [theme.breakpoints.up('xl')]: {
      fontSize: 34
    }
  },
  postLink: {
    textDecoration: 'none'
  }
});

const Entry = props => {
  const classes = props.classes;
  const post = props.post;

  return (
    <Grid className={classes.root} item xs={12} sm={6}>
      <Paper className={classes.paper} style={{
        backgroundImage: `url(http://lorempixel.com/1280/720?id=${post.slug})`
      }}>
        <div className={classes.content}>
          <Link to={`${post.slug}`} className={classes.postLink}>
            <h2 className={classes.title}>{post.title}</h2>
          </Link>
          <Author post={post} />
        </div>
      </Paper>
    </Grid>
  );
};

export default withStyles(styles)(Entry);
