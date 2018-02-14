import React from 'react';
import Link from 'gatsby-link';

import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderStyle: 'solid',
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  avatarDark: {
    width: 40,
    height: 40,
    borderStyle: 'solid',
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  info: {
    flex: '1 1 auto',
    padding: '0px 16px',
  },
  name: {
    fontSize: 16,
    lineHeight: '24px',
    color: '#fff',
    textDecoration: 'none',
  },
  nameDark: {
    fontSize: 16,
    lineHeight: '24px',
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  date: {
    fontSize: 14,
    lineHeight: '20px',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dateDark: {
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.text.secondary,
  },
});

export default withStyles(styles)(({classes, article, dark}) => {
  const author = article.authorData;
  return (
    <div className={classes.root}>
      <img
        src={`https://www.gravatar.com/avatar/${author.emailHash}?s=120`}
        className={dark ? classes.avatarDark : classes.avatar}
      />
      <div className={classes.info}>
        <Link
          to={`/authors/${article.author}/`}
          className={dark ? classes.nameDark : classes.name}
          title={author.name}>
          {author.name}
        </Link>
        <div className={dark ? classes.dateDark : classes.date}>{article.date}</div>
      </div>
    </div>
  );
});
