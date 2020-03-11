import React from 'react';
import { createStyles, Fab, FabProps, Theme } from '@material-ui/core';
import { Facebook } from './icons';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  facebook: {
    color: theme.palette.common.white,
    backgroundColor: '#3b5998',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#5573B2',
    },
  },
}));

type FacebookButtonProps = {
  component?: React.ElementType;
} & FabProps;

const FacebookButton: React.FC<FacebookButtonProps> = (props: FacebookButtonProps) => {
  const { component, className, ...rest } = props;
  const classes = useStyles();

  return (
    <Fab component={component || 'button'} className={classNames(classes.facebook, className)} {...rest}>
      <Facebook/>
    </Fab>
  );
};

export default FacebookButton;
