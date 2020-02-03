import React from 'react';
import { HomeData } from './types';
import { ArticleInfo } from '../article/types';
import Page from '../core/Page';
import ArticleCard from '../article/ArticleCard';
import HomeMeta from './HomeMeta';
import Pagination from './Pagination';

type HomePageProps = {
  data: HomeData;
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  articles: ArticleInfo[];
};

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { data: { meta }, pageNumber, articlesPerPage, totalArticles, articles } = props;

  return (
    <Page>
      <HomeMeta data={meta}/>

      {articles.map((article) => <ArticleCard info={article} key={article.slug}/>)}

      <Pagination pageNumber={pageNumber} articlesPerPage={articlesPerPage} totalArticles={totalArticles}/>
    </Page>
  );
};

export default HomePage;
