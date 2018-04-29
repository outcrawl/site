import React from 'react';

import { HomeMeta } from './meta';
import { Page } from './page';
import Entry from './entry';
import Pagination from './pagination';

const HomePage = ({ page, pageNumber, articlesPerPage, totalArticles }) => {
  page.url =
    page.meta.site.siteUrl + (pageNumber == 1 ? '' : `/page/${pageNumber}`);
  const articles = page.articles;

  return (
    <Page>
      <HomeMeta page={page} />

      {articles.map((article) => (
        <Entry article={article} key={article.slug} />
      ))}
      <Pagination
        page={pageNumber}
        articlesPerPage={articlesPerPage}
        totalArticles={totalArticles}
      />
    </Page>
  );
};

export default HomePage;
