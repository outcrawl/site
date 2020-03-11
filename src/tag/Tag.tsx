import React from 'react';
import { Link } from 'gatsby';
import { Chip, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: 0,
    paddingRight: 0,
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    alignSelf: 'last baseline',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

type TagProps = {
  title: string;
  to: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Tag: React.FC<TagProps> = (props: TagProps) => {
  const { title, to, className } = props;
  const classes = useStyles();

  return (
    <Link to={to} className={classNames(classes.root, className)}>
      <Chip onClick={(): null => null} label={title}/>
    </Link>
  );
};

export default Tag;
