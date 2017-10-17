import React from 'react';
import Link from 'gatsby-link';

import withStyles from './ui/withStyles';
import Paper from './ui/Paper';
import Grid from './ui/Grid';
import Author from './Author';


const styles = theme => ({
  root: {
    width: '100%',
    height: 250,
    boxSizing: 'border-box',
    position: 'relative',
    padding: 8
  },
  paper: {
    position: 'absolute',
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  },
  content: {
    width: '100%',
    height: '100%',
    padding: 16,
    background: 'linear-gradient(0, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.3) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    boxSizing: 'border-box'
  },
  title: {
    color: theme.palette.shades.dark.text.primary,
    fontWeight: 400,
    margin: 0,
    textDecoration: 'none',
    fontSize: 24,
    lineHeight: 1.25
  },
  articleLink: {
    textDecoration: 'none',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: 16,
    '&:hover': {
      textDecoration: 'none'
    }
  }
});

export default withStyles(styles)(({ classes, article }) => {
  const cover = article.cover ? article.cover : `http://lorempixel.com/1280/720?id=${article.slug}`;

  return (
    <Grid className={classes.root} item xs={12} sm={6}>
      <Paper className={classes.paper} style={{
        backgroundImage: `url(${cover})`
      }}>
        <div className={classes.content}>
          <Link to={article.slug} className={classes.articleLink} aria-label={article.title}>
            <h2 className={classes.title}>{article.title}</h2>
          </Link>
          <Author article={article} />
        </div>
      </Paper>
    </Grid>
  );
});
