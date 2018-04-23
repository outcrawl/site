import React from 'react';
import Link from 'gatsby-link';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui';

import Tag from './tag';
import ArticleShare from './share';

const styles = (theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
});

const ArticleFooter = ({ article, classes }) => (
  <Grid className={classes.root} item xs={12} component="section">
    <div className={classes.tags}>
      {article.tags.map((tag, i) => <Tag key={tag.slug} tag={tag} />)}
    </div>
    <ArticleShare className={classes.share} article={article} />
  </Grid>
);

export default withStyles(styles)(ArticleFooter);
