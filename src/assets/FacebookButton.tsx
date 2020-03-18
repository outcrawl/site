import { createStyles, Fab, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import { Facebook } from './icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    color: theme.palette.common.white,
    backgroundColor: '#3b5998',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#4B6EB9',
    },
  },
}));

type FacebookButtonProps = {
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const FacebookButton: React.FC<FacebookButtonProps> = (props: FacebookButtonProps) => {
  const { className, href } = props;
  const classes = useStyles();

  return (
    <Fab
      className={classNames(classes.root, className)}
      href={href}
      size="small"
      rel="noopener noreferrer"
    >
      <Facebook/>
    </Fab>
  );
};

export default FacebookButton;
