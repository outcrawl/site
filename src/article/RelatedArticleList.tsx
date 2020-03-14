import React from 'react';
import { ArticleData } from './types';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from 'gatsby';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {},
}));

type RelatedArticleListProps = {
  articles: ArticleData[];
} & React.HTMLAttributes<HTMLDivElement>;

const RelatedArticleList: React.FC<RelatedArticleListProps> = (props: RelatedArticleListProps) => {
  const { className, articles } = props;
  const classes = useStyles();

  return (
    <Box className={classNames(classes.root, className)}>
      <Typography variant="h2">Related</Typography>
      {articles.map((article) => (
        <Link key={article.slug} to={article.slug}>
          <Typography variant="h4">{article.title}</Typography>
        </Link>
      ))}
    </Box>
  );
};

export default RelatedArticleList;
