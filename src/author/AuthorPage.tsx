import ArticleGroupedList from '../article/ArticleGroupedList';
import { ArticleData } from '../article/types';
import Page from '../common/Page';
import { loadConfig } from '../config';
import GeneralPageMeta from '../general-page/GeneralPageMeta';
import AuthorHeader from './AuthorHeader';
import { AuthorData } from './types';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

type AuthorPageProps = {
  author: AuthorData;
  articles: ArticleData[];
};

const AuthorPage: React.FC<AuthorPageProps> = ({
  author,
  articles,
}: AuthorPageProps) => {
  const config = loadConfig();

  return (
    <Page narrow>
      <GeneralPageMeta
        title={`${author.name} - ${config.title}`}
        description={author.bio}
        url={author.url}
      />
      <AuthorHeader author={author} />
      <Box>
        <Typography variant="h2" gutterBottom>
          Articles
        </Typography>
        <ArticleGroupedList articles={articles} />
      </Box>
    </Page>
  );
};

export default AuthorPage;
