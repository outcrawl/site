import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import md5 from 'md5';

import authors from '../data/authors.js';

const styles = theme => ({
  root: {
    display: 'flex'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: [1, 'solid', theme.palette.shades.dark.text.divider]
  },
  info: {
    flex: '1 1 auto',
    padding: [0, 16]
  },
  name: {
    fontSize: 16,
    lineHeight: '24px',
    color: theme.palette.shades.dark.text.primary,
    textDecoration: 'none'
  },
  date: {
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.shades.dark.text.secondary
  }
});

const Author = props => {
  const classes = props.classes;
  const post = props.post;
  const author = authors[post.author];

  return (
    <div className={classes.root}>
      <Avatar
        alt="Author Avatar"
        src={`https://www.gravatar.com/avatar/${md5(author.email.toLowerCase())}?s=120`}
        className={classes.avatar}
      />
      <div className={classes.info}>
        <Link to={`authors/${post.author}`} className={classes.name}>{author.name}</Link>
        <div className={classes.date}>{post.date}</div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Author);
