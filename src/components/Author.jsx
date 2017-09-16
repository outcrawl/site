import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

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
  avatarDark: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: [1, 'solid', theme.palette.shades.light.text.divider]
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
  nameDark: {
    fontSize: 16,
    lineHeight: '24px',
    color: theme.palette.shades.light.text.primary,
    textDecoration: 'none'
  },
  date: {
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.shades.dark.text.secondary
  },
  dateDark: {
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.shades.light.text.secondary
  }
});

const Author = props => {
  const classes = props.classes;
  const post = props.post;
  const author = post.authorData;
  const dark = props.dark;

  return (
    <div className={classes.root}>
      <Avatar
        alt="Author Avatar"
        src={`https://www.gravatar.com/avatar/${author.emailHash}?s=120`}
        className={dark ? classes.avatarDark : classes.avatar}
      />
      <div className={classes.info}>
        <Link to={`authors/${post.author}`} className={dark ? classes.nameDark : classes.name}>{author.name}</Link>
        <div className={dark ? classes.dateDark : classes.date}>{post.date}</div>
      </div>
    </div>
  );
};

export default withStyles(styles)(Author);
