import * as React from 'react';
import { Button, createStyles, Theme, withStyles } from '@material-ui/core';
import classNames from 'classnames';

import { Facebook, GitHub, GooglePlus, Twitter } from './icons';

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
  googlePlus: {
    color: theme.palette.common.white,
    backgroundColor: '#d34836',
    '&:hover': {
      backgroundColor: '#ED6250',
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
  <Button className={classNames(classes.twitter, className)} {...rest}>
    <Twitter/>
  </Button>
));

const FacebookButton = withStyles(styles)(({ classes, className, ...rest }: any) => (
  <Button className={classNames(classes.facebook, className)} {...rest}>
    <Facebook/>
  </Button>
));

const GooglePlusButton = withStyles(styles)(
  ({ classes, className, ...rest }: any) => (
    <Button className={classNames(classes.googlePlus, className)} {...rest}>
      <GooglePlus/>
    </Button>
  ),
);

const GitHubButton = withStyles(styles)(({ classes, className, ...rest }: any) => (
  <Button className={classNames(classes.github, className)} {...rest}>
    <GitHub/>
  </Button>
));

export {
  TwitterButton,
  FacebookButton,
  GooglePlusButton,
  GitHubButton,
};
