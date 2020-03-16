import { Box } from '@material-ui/core';
import React from 'react';
import BasicPageMeta from '../core/BasicPageMeta';
import Page from '../core/Page';
import { PageData } from '../core/types';
import AuthorArticleList from './AuthorArticleList';
import AuthorHeader from './AuthorHeader';
import { AuthorArticleData, AuthorData } from './types';

type AuthorPageProps = {
  page: PageData;
  author: AuthorData;
  articles: AuthorArticleData[];
}

const AuthorPage: React.FC<AuthorPageProps> = (props: AuthorPageProps) => {
  const { page, author, articles } = props;

  return (
    <Page narrow>
      <BasicPageMeta {...page}/>
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
