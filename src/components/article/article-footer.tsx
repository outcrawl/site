import * as React from 'react';
import { createStyles, Grid, Theme, withStyles } from '@material-ui/core';
import { Article } from './types';
import Tag from './tag';
import ArticleShare from './article-share';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
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
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
});

interface ArticleFooterProps {
  article: Article;
  classes?: {
    root: string;
    tags: string;
    share: string;
  };
}

class ArticleFooter extends React.PureComponent<ArticleFooterProps> {
  public render() {
    const { article, classes } = this.props;

    return (
      <Grid className={classes.root} item xs={12} component="section">
        <div className={classes.tags}>
          {article.tags.map((tag, i) => <Tag key={i} title={tag.title} to={`/tags/${tag.slug}`}/>)}
        </div>
        <ArticleShare className={classes.share} article={article}/>
      </Grid>
    );
  }
}

export default withStyles(styles)(ArticleFooter);
