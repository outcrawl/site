import React from 'react';

import { SiteMeta, PageMeta } from './meta';
import { Page } from './page';
import Entry from './entry';
import Pagination from './pagination';

const HomePage = ({ meta, articles, page, articlesPerPage, totalArticles }) => (
  <Page>
    <SiteMeta meta={meta} />
    <PageMeta
      meta={meta}
      title={`${meta.site.title} - ${meta.site.description}`}
      description={meta.site.description}
      url={meta.site.siteUrl + (page == 1 ? '' : `/page/${page}/`)}
    />

    {articles.map((article) => <Entry article={article} key={article.slug} />)}
    <Pagination
      page={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
    />
  </Page>
);

export default HomePage;
