import { loadArticles } from '../../article/data';
import { ArticleData } from '../../article/types';
import { loadConfig } from '../../config';
import HomePage from '../../home/HomePage';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import React from 'react';

type HomePageRoutePagedProps = {
  articles: ArticleData[];
  page: number;
  pageCount: number;
};

type HomePageRoutePagedQuery = { page: string };

const HomePageRoutePaged: NextPage<HomePageRoutePagedProps> = ({
  articles,
  page,
  pageCount,
}: HomePageRoutePagedProps) => (
  <HomePage articles={articles} page={page} pageCount={pageCount} />
);

export default HomePageRoutePaged;

export const getStaticProps: GetStaticProps<
  HomePageRoutePagedProps,
  HomePageRoutePagedQuery
> = async ({ params }) => {
  if (params === undefined) {
    throw Error('Not found');
  }

  const page = Number(params.page);

  const config = loadConfig();
  const articles = await loadArticles();
  const pageCount = Math.ceil(articles.length / config.articlesPerPage);

  return Promise.resolve({
    props: {
      articles: articles.slice(
        (page - 1) * config.articlesPerPage,
        (page - 1) * config.articlesPerPage + config.articlesPerPage,
      ),
      page,
      pageCount,
    },
  });
};

export const getStaticPaths: GetStaticPaths<
  HomePageRoutePagedQuery
> = async () => {
  const config = loadConfig();
  const articles = await loadArticles();
  const pageCount = Math.ceil(articles.length / config.articlesPerPage);
  return {
    paths: Array.from(Array(pageCount)).map((_, i) => ({
      params: { page: (i + 1).toString() },
    })),
    fallback: false,
  };
};
