import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import AuthorCard from '../author/AuthorCard';
import ArticleShare from './ArticleShare';
import { ArticlePageData } from './types';

const useStyles = makeStyles((theme: Theme) => createStyles({
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
      marginTop: theme.spacing(1),
    },
  },
}));

type ArticleHeaderProps = {
  articlePage: ArticlePageData;
} & React.HTMLAttributes<HTMLElement>;

const ArticleHeader: React.FC<ArticleHeaderProps> = (props: ArticleHeaderProps) => {
  const { articlePage: { article }, className } = props;
  const classes = useStyles();

  return (
    <section className={classNames(classes.root, className)}>
      {article.author && <AuthorCard author={article.author} subtitle={article.date}/>}
      <ArticleShare article={article} className={classes.share}/>
    </section>
  );
};

export default ArticleHeader;
