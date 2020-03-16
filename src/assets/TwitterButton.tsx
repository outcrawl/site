import { createStyles, Fab, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import { Twitter } from './icons';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    color: theme.palette.common.white,
    backgroundColor: '#00aced',
    '&:hover': {
      backgroundColor: '#1FC3FF',
    },
  },
}));

type TwitterButtonProps = {
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const TwitterButton: React.FC<TwitterButtonProps> = (props: TwitterButtonProps) => {
  const { className, href } = props;
  const classes = useStyles();

  return (
    <Fab
      className={classNames(classes.root, className)}
      href={href}
      size="small"
      rel="noopener noreferrer"
    >
      <Twitter/>
    </Fab>
  );
};

export default TwitterButton;
