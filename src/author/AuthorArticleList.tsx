import { Box, Typography } from '@material-ui/core';
import { Link } from 'gatsby';
import React from 'react';
import { AuthorArticleData } from './types';

type AuthorArticleListProps = {
  articles: AuthorArticleData[];
}

const AuthorArticleList: React.FC<AuthorArticleListProps> = (props: AuthorArticleListProps) => {
  const { articles } = props;
  const articlesByDate = articles.reduce((group: Record<string, AuthorArticleData[]>, article: AuthorArticleData) => {
    if (group[article.groupDate]) {
      group[article.groupDate].push(article);
    } else {
      group[article.groupDate] = [article];
    }
    return group;
  }, {});

  return (
    <Box>
      <Typography variant="h2" gutterBottom>Articles</Typography>
      {Object.keys(articlesByDate).map((date) => (
        <Box key={date}>
          <Typography variant="h5">{date}</Typography>
          <ul>
            {articlesByDate[date].map((article) => (
              <li key={article.slug}>
                <Link to={'/' + article.slug}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </Box>
  );
};

export default AuthorArticleList;
