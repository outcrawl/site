import * as React from 'react';
import Link from 'gatsby-link';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import classNames from 'classnames';

import Author from './author';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
    borderRadius: '50%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
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
    color: theme.palette.text.primary,
    textDecoration: 'none',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
});

interface AuthorCardProps {
  author: Author;
  subtitle?: string;
  className?: string;
  classes?: {
    root: string;
    avatar: string;
    content: string;
    author: string;
    subtitle: string;
  };
}

class AuthorCard extends React.PureComponent<AuthorCardProps> {
  public render() {
    const { author, subtitle, className, classes } = this.props;

    return (
      <div className={classNames(classes.root, className)}>
        <img
          className={classes.avatar}
          src={author.avatar}
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
  }
}

export default withStyles(styles)(AuthorCard);
