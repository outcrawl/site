import { loadArticles } from '../article/data';
import { ArticleData } from '../article/types';
import { loadConfig } from '../config';
import HomePage from '../home/HomePage';
import type { GetStaticProps, NextPage } from 'next';
import React from 'react';

type HomePageRouteProps = {
  articles: ArticleData[];
  pageCount: number;
};

const HomePageRoute: NextPage<HomePageRouteProps> = ({
  articles,
  pageCount,
}: HomePageRouteProps) => (
  <HomePage articles={articles} page={1} pageCount={pageCount} />
);

export default HomePageRoute;

export const getStaticProps: GetStaticProps<HomePageRouteProps> = async () => {
  const config = loadConfig();
  const articles = await loadArticles();
  const pageCount = Math.ceil(articles.length / config.articlesPerPage);
  return Promise.resolve({
    props: {
      articles: articles.slice(0, config.articlesPerPage),
      pageCount,
    },
  });
};
