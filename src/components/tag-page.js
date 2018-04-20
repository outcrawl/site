import React from 'react';

import Entry from '../components/entry';
import Pagination from './pagination';

const TagPage = ({ tag, articles, page, articlesPerPage, totalArticles }) => (
  <div className="page">
    <h1 className="page__title">{tag.name}</h1>

    <div className="page__entries">
      {articles.map((article) => (
        <Entry article={article} key={article.slug} />
      ))}
    </div>

    <Pagination
      className="page__pagination"
      page={page}
      articlesPerPage={articlesPerPage}
      totalArticles={totalArticles}
      basePath={`/tags/${tag.slug}`}
    />
  </div>
);

export default TagPage;
