import React from 'react';

import { TagMeta } from './meta';
import { Page, PageSection } from './page';
import Entry from './entry';
import Pagination from './pagination';

const TagPage = ({ page, pageNumber, articlesPerPage, totalArticles }) => {
  const tag = page.tag;
  page.url =
    page.meta.site.siteUrl +
    '/tags/' +
    tag.slug +
    (pageNumber == 1 ? '' : `/page/${pageNumber}`);
  const articles = page.articles;

  return (
    <Page>
      <TagMeta page={page} />

      <PageSection>
        <h1>{tag.name}</h1>
      </PageSection>
      {articles.map((article) => (
        <Entry article={article} key={article.slug} />
      ))}
      <Pagination
        page={pageNumber}
        articlesPerPage={articlesPerPage}
        totalArticles={totalArticles}
        basePath={`/tags/${tag.slug}`}
      />
    </Page>
  );
};

export default TagPage;
