import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

import {
  TwitterIcon,
  FacebookIcon,
  GooglePlusIcon
} from '../Icons';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  button: {
    margin: 4,
    width: 36,
    height: 36
  },
  icon: {
    width: '20px !important',
    height: '20px !important',
    fill: '#fff'
  }
});

const Share = ({ post, classes }) => (
  <div className={classes.root}>
    <Button fab dense aria-label="Share on Twitter" className={classes.button}
      href={`https://twitter.com/intent/tweet?url=${post.permalink}&text=${post.title}`}
      style={{
        backgroundColor: '#32CCFE'
      }}>
      <TwitterIcon className={classes.icon} />
    </Button>
    <Button fab dense aria-label="Share on Facebook" className={classes.button}
      href={`https://www.facebook.com/sharer/sharer.php?u=${post.permalink}`}
      style={{
        backgroundColor: '#3B5998'
      }}>
      <FacebookIcon className={classes.icon} />
    </Button>
    <Button fab dense aria-label="Share on Google+" className={classes.button}
      href={`https://plus.google.com/share?url=${post.permalink}`}
      style={{
        backgroundColor: '#DD4B39'
      }}>
      <GooglePlusIcon className={classes.icon} />
    </Button>
  </div>
);

export default withStyles(styles)(Share);
