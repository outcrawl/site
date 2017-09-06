import React from 'react';
import Link from 'gatsby-link';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

const styles = theme => ({
  root: {
    width: '100%',
    height: 250,
    boxSizing: 'border-box',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    position: 'relative'
  },
  content: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: theme.spacing.unit * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  title: {
    ...theme.typography.headline,
    color: theme.palette.shades.dark.text.primary,
    margin: 0,
    textDecoration: 'none'
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 16
  }
});

const Author = props => (
  <div>
    <Avatar
      alt="Adelle Charles"
      src={`http://lorempixel.com/40/40`}
      className={styles.avatar}
    />
  </div>
);

const Entry = props => {
  const classes = props.classes;
  const post = props.post;
  Object.assign(post, post.frontmatter);
  Object.assign(post, post.fields);
  return (
    <Paper className={classes.root} style={{
      backgroundImage: `url(http://lorempixel.com/1280/720?id=${post.slug})`
    }}>
      <div className={classes.content}>
        <Link to={`${post.slug}`} style={{ textDecoration: 'none' }}>
          <h2 className={classes.title}>{post.title}</h2>
        </Link>
        <Author />
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Entry);
