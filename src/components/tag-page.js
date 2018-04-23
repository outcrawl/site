import React from 'react';

import { SiteMeta, PageMeta } from './meta';
import { Page, PageSection } from './page';
import Entry from './entry';
import Pagination from './pagination';

const TagPage = ({
  meta,
  tag,
  articles,
  page,
  articlesPerPage,
  totalArticles,
}) => (
  <Page>
    <SiteMeta meta={meta} />
    <PageMeta
      meta={meta}
      title={`${tag.name} - ${meta.site.title}`}
      description={`Articles about ${tag.name} on ${meta.site.title}.`}
      url={`${meta.site.siteUrl}/tags/${tag.slug}/`}
    />

    <PageSection>
      <h1>{tag.name}</h1>
    </PageSection>
    {articles.map((article) => <Entry article={article} key={article.slug} />)}
    <Pagination
      page={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
      basePath={`/tags/${tag.slug}`}
    />
  </Page>
);

export default TagPage;
