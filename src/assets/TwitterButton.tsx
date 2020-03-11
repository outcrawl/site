import React from 'react';
import { createStyles, Fab, FabProps, Theme } from '@material-ui/core';
import { Twitter } from './icons';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  twitter: {
    color: theme.palette.common.white,
    backgroundColor: '#00aced',
    '&:hover': {
      backgroundColor: '#1AC6FF',
    },
  },
}));

type TwitterButtonProps = {
  component?: React.ElementType;
} & FabProps;

const TwitterButton: React.FC<TwitterButtonProps> = (props: TwitterButtonProps) => {
  const { component, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Fab component={component || 'button'} className={classNames(classes.twitter, className)} {...rest}>
      <Twitter/>
    </Fab>
  );
};

export default TwitterButton;
