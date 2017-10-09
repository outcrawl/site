import React from 'react';
import Link from 'gatsby-link';

import withStyles from '../ui/withStyles';
import Button from '../ui/Button';

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
    paddingBottom: 8
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

class Share extends React.Component {
  render() {
    const { article, classes } = this.props;
    return (
      <div className={classes.root}>
        <Button fab dense aria-label="Share on Twitter" className={classes.button}
          href={`https://twitter.com/intent/tweet?url=${article.permalink}&text=${article.title}`}
          onClick={() => this.handleShareClick('twitter')}
          style={{
            backgroundColor: '#32CCFE'
          }}>
          <TwitterIcon className={classes.icon} />
        </Button>
        <Button fab dense aria-label="Share on Facebook" className={classes.button}
          href={`https://www.facebook.com/sharer/sharer.php?u=${article.permalink}`}
          onClick={() => this.handleShareClick('facebook')}
          style={{
            backgroundColor: '#3B5998'
          }}>
          <FacebookIcon className={classes.icon} />
        </Button>
        <Button fab dense aria-label="Share on Google+" className={classes.button}
          href={`https://plus.google.com/share?url=${article.permalink}`}
          onClick={() => this.handleShareClick('googlePlus')}
          style={{
            backgroundColor: '#DD4B39'
          }}>
          <GooglePlusIcon className={classes.icon} />
        </Button>
      </div>
    );
  }

  handleShareClick = (event, site) => {
    if (ga) {
      ga('send', 'event', 'Share', site);
    }
  }
}

export default withStyles(styles)(Share);
