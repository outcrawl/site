import React from 'react';
import { createStyles, Fab, Theme } from '@material-ui/core';
import { GitHub } from './icons';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    color: theme.palette.common.white,
    backgroundColor: '#000000',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#1A1A1A',
    },
  },
}));

type GitHubButtonProps = {
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const GitHubButton: React.FC<GitHubButtonProps> = (props: GitHubButtonProps) => {
  const { className, href } = props;
  const classes = useStyles();

  return (
    <Fab
      className={classNames(classes.root, className)}
      href={href}
      size="small"
      rel="noopener noreferrer"
    >
      <GitHub/>
    </Fab>
  );
};

export default GitHubButton;
