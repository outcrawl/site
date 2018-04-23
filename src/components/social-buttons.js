import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui';
import classNames from 'classnames';

import { Twitter, Facebook, GooglePlus, GitHub } from './icons';

const styles = (theme) => ({
  twitter: {
    color: [theme.palette.common.white, '!important'],
    backgroundColor: '#00aced',
    '&:hover': {
      backgroundColor: '#1AC6FF',
    },
  },
  facebook: {
    color: [theme.palette.common.white, '!important'],
    backgroundColor: '#3b5998',
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: '#5573B2',
    },
  },
  googlePlus: {
    color: [theme.palette.common.white, '!important'],
    backgroundColor: '#d34836',
    '&:hover': {
      backgroundColor: '#ED6250',
    },
  },
  github: {
    color: [theme.palette.common.white, '!important'],
    backgroundColor: '#212121',
    '&:hover': {
      backgroundColor: '#3B3B3B',
    },
  },
});

const TwitterButton = withStyles(styles)(({ classes, className, ...rest }) => (
  <Button className={classNames(classes.twitter, className)} {...rest}>
    <Twitter />
  </Button>
));

const FacebookButton = withStyles(styles)(({ classes, className, ...rest }) => (
  <Button className={classNames(classes.facebook, className)} {...rest}>
    <Facebook />
  </Button>
));

const GooglePlusButton = withStyles(styles)(
  ({ classes, className, ...rest }) => (
    <Button className={classNames(classes.googlePlus, className)} {...rest}>
      <GooglePlus />
    </Button>
  ),
);

const GitHubButton = withStyles(styles)(({ classes, className, ...rest }) => (
  <Button className={classNames(classes.github, className)} {...rest}>
    <GitHub />
  </Button>
));

export default {
  TwitterButton,
  FacebookButton,
  GooglePlusButton,
  GitHubButton,
};
