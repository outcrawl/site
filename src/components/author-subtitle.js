import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';
import classNames from 'classnames';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
    borderRadius: '50%',
    border: [[1, 'solid', theme.palette.divider]],
    width: 40,
    height: 40,
    flexShrink: 0,
  },
  content: {
    flex: '1 1 auto',
  },
  author: {
    margin: 0,
    display: 'block',
    color: [theme.palette.text.primary, '!important'],
    textDecoration: 'none',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
});

const AuthorSubtitle = ({ author, subtitle, classes, className }) => (
  <div className={classNames(classes.root, className)}>
    <img
      className={classes.avatar}
      src={`https://www.gravatar.com/avatar/${author.emailHash}?s=120`}
      alt={author.name}
    />
    <div className={classes.content}>
      <Link className={classes.author} to={`/authors/${author.slug}`}>
        {author.name}
      </Link>
      <span className={classes.subtitle}>{subtitle}</span>
    </div>
  </div>
);

export default withStyles(styles)(AuthorSubtitle);
