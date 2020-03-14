import React from 'react';
import { AuthorArticleData, AuthorData } from './types';
import Page from '../core/Page';
import AuthorHeader from './AuthorHeader';
import AuthorArticleList from './AuthorArticleList';
import { Box } from '@material-ui/core';

type AuthorPageProps = {
  author: AuthorData;
  articles: AuthorArticleData[];
}

const AuthorPage: React.FC<AuthorPageProps> = (props: AuthorPageProps) => {
  const { author, articles } = props;

  return (
    <Page narrow>
      <Box mb={3}>
        <AuthorHeader author={author}/>
      </Box>
      <Box>
        <AuthorArticleList articles={articles}/>
      </Box>
    </Page>
  );
};

export default AuthorPage;
