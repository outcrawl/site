import React from 'react';
import { createStyles, Fab, Theme } from '@material-ui/core';
import { Linkedin } from './icons';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    color: theme.palette.common.white,
    backgroundColor: '#2867B2',
    '&:hover': {
      backgroundColor: '#3C80D3',
    },
  },
}));

type LinkedinButtonProps = {
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const LinkedinButton: React.FC<LinkedinButtonProps> = (props: LinkedinButtonProps) => {
  const { className, href } = props;
  const classes = useStyles();

  return (
    <Fab
      className={classNames(classes.root, className)}
      href={href}
      size="small"
      rel="noopener noreferrer"
    >
      <Linkedin/>
    </Fab>
  );
};

export default LinkedinButton;
