import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui';
import classNames from 'classnames';

import { Twitter, Facebook, GooglePlus } from '../icons';

const styles = (theme) => ({
  buttonLeftMargin: {
    marginLeft: theme.spacing.unit,
  },
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
});

const ArticleShare = ({ article, classes, className }) => (
  <div className={classNames(classes.root, className)}>
    <Button
      className={classes.twitter}
      component="a"
      variant="fab"
      mini
      href={`https://twitter.com/intent/tweet?url=${article.permalink}&text=${
        article.title
      }`}
      aria-label="Share on Twitter"
    >
      <Twitter />
    </Button>
    <Button
      className={classNames(classes.facebook, classes.buttonLeftMargin)}
      component="a"
      variant="fab"
      mini
      href={`https://www.facebook.com/sharer/sharer.php?u=${article.permalink}`}
      aria-label="Share on Facebook"
    >
      <Facebook />
    </Button>
    <Button
      className={classNames(classes.googlePlus, classes.buttonLeftMargin)}
      component="a"
      variant="fab"
      mini
      href={`https://plus.google.com/share?url=${article.permalink}`}
      aria-label="Share on Google+"
    >
      <GooglePlus />
    </Button>
  </div>
);

export default withStyles(styles)(ArticleShare);
