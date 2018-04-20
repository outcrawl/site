import React from 'react';

import { Page } from './page';
import Entry from './entry';
import Pagination from './pagination';

const HomePage = ({ articles, page, articlesPerPage, totalArticles }) => (
  <Page>
    {articles.map((article) => <Entry article={article} key={article.slug} />)}
    <Pagination
      page={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
    />
  </Page>
);

export default HomePage;
