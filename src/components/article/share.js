import React from 'react';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui';
import classNames from 'classnames';

import {
  TwitterButton,
  FacebookButton,
  GooglePlusButton,
} from '../social-buttons';

const styles = (theme) => ({
  socialButton: {
    marginLeft: theme.spacing.unit,
  },
});

const ArticleShare = ({ article, classes, className }) => (
  <div className={classNames(classes.root, className)}>
    <TwitterButton
      component="a"
      variant="fab"
      mini
      href={`https://twitter.com/intent/tweet?url=${article.permalink}&text=${
        article.title
      }`}
      aria-label="Share on Twitter"
    />
    <FacebookButton
      className={classes.socialButton}
      component="a"
      variant="fab"
      mini
      href={`https://www.facebook.com/sharer/sharer.php?u=${article.permalink}`}
      aria-label="Share on Facebook"
    />
    <GooglePlusButton
      className={classes.socialButton}
      component="a"
      variant="fab"
      mini
      href={`https://plus.google.com/share?url=${article.permalink}`}
      aria-label="Share on Google+"
    />
  </div>
);

export default withStyles(styles)(ArticleShare);
