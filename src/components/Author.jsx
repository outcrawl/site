import React from 'react';
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
    marginRight: 16,
    borderRadius: '50%',
    border: [1, 'solid', theme.palette.shades.dark.text.divider]
  },
  name: {
    fontSize: 16,
    color: theme.palette.shades.dark.text.primary
  },
  date: {
    fontSize: 14,
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
        <div className={classes.name}>{author.name}</div>
        <div className={classes.date}>{post.date}</div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Author);
