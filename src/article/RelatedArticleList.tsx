import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'gatsby';
import React from 'react';
import { ArticleData } from './types';

const useStyles = makeStyles({
  link: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
});

type RelatedArticleListProps = {
  articles: ArticleData[];
} & React.HTMLAttributes<HTMLElement>;

const RelatedArticleList: React.FC<RelatedArticleListProps> = (props: RelatedArticleListProps) => {
  const { className, articles } = props;
  const classes = useStyles();

  return (
    <Box className={className}>
      <Typography variant="h2" gutterBottom>Related</Typography>
      <Box textAlign="center">
        {articles.map((article) => (
          <Link key={article.slug} to={'/' + article.slug}>
            <Typography className={classes.link} variant="h4">{article.title}</Typography>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default RelatedArticleList;
