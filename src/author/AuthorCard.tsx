import { Avatar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Link } from 'gatsby';
import React from 'react';
import { AuthorData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatar: {
    flexShrink: 0,
    marginRight: theme.spacing(1),
  },
  info: {
    flex: '1 1 auto',
  },
  name: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
  },
  subtitle: {
    color: theme.palette.text.secondary,
  },
}));

type AuthorCardProps = {
  author: AuthorData;
  subtitle?: string;
} & React.HTMLAttributes<HTMLElement>;

const AuthorCard: React.FC<AuthorCardProps> = (props: AuthorCardProps) => {
  const { author, subtitle, className } = props;
  const classes = useStyles();

  return (
    <div className={classNames(classes.root, className)}>
      <Avatar className={classes.avatar} alt={author.name} src={author.avatar} variant="circle"/>
      <div className={classes.info}>
        <Link className={classes.name} to={`/authors/${author.slug}/`}>
          {author.name}
        </Link>
        {subtitle && (
          <Typography className={classes.subtitle} variant="body2">
            {subtitle}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
