import React from 'react';
import { withStyles } from 'material-ui/styles';
import ReactDisqusThread from 'react-disqus-thread';

const styles = theme => ({
  root: {
    padding: '16px 0px',
    [theme.breakpoints.up('sm')]: {
      padding: '48px 0px 24px 0px',
    },
  },
});

const Comments = ({ article, classes }) => (
  <div className={classes.root}>
    <h1>Comments</h1>
    <div className={classes.content}>

      <ReactDisqusThread
				shortname="outcrawl"
				identifier={article.slug}
				title={article.title}
				url={article.permalink}/>

    </div>
  </div>
);

export default withStyles(styles)(Comments);
