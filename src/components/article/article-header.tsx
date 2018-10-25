import * as React from 'react';
import { createStyles, Theme, withStyles } from '@material-ui/core';
import { format as dateFormat } from 'date-fns';
import classNames from 'classnames';

import Article from './article';
import AuthorCard from '../author/author-card';
import ArticleShare from './article-share';

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  share: {
    display: 'flex',
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: theme.spacing.unit,
    },
  },
});

interface ArticleHeaderProps {
  article: Article;
  className?: string;
  classes?: {
    root: string;
    share: string;
  };
}

class ArticleHeader extends React.PureComponent<ArticleHeaderProps> {
  public render() {
    const { article, className, classes } = this.props;

    return (
      <section className={classNames(classes.root, className)}>
        <AuthorCard author={article.author} subtitle={dateFormat(article.date, 'DD MMMM, YYYY')}/>
        <ArticleShare article={article} className={classes.share}/>
      </section>
    );
  }
}

export default withStyles(styles)(ArticleHeader);
