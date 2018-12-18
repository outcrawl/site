import * as React from 'react';
import { createStyles, Fab, Theme, withStyles } from '@material-ui/core';
import classNames from 'classnames';

import { Facebook, GitHub, Twitter } from './icons';

const styles = (theme: Theme) => createStyles({
  twitter: {
    color: theme.palette.common.white,
    backgroundColor: '#00aced',
    '&:hover': {
      backgroundColor: '#1AC6FF',
    },
  },
  facebook: {
    color: theme.palette.common.white,
    backgroundColor: '#3b5998',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#5573B2',
    },
  },
  github: {
    color: theme.palette.common.white,
    backgroundColor: '#212121',
    '&:hover': {
      backgroundColor: '#3B3B3B',
    },
  },
});

const TwitterButton = withStyles(styles)(({ classes, className, ...rest }: any) => (
  <Fab className={classNames(classes.twitter, className)} {...rest}>
    <Twitter/>
  </Fab>
));

const FacebookButton = withStyles(styles)(({ classes, className, ...rest }: any) => (
  <Fab className={classNames(classes.facebook, className)} {...rest}>
    <Facebook/>
  </Fab>
));

const GitHubButton = withStyles(styles)(({ classes, className, ...rest }: any) => (
  <Fab className={classNames(classes.github, className)} {...rest}>
    <GitHub/>
  </Fab>
));

export {
  TwitterButton,
  FacebookButton,
  GitHubButton,
};
