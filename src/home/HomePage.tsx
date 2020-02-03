import React from 'react';
import { HomePageData } from './types';
import { ArticleData } from '../article/types';
import Page from '../core/Page';
import ArticleCard from '../article/ArticleCard';
import HomeMeta from './HomeMeta';
import Pagination from './Pagination';

type HomePageProps = {
  data: HomePageData;
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  articles: ArticleData[];
};

const HomePage: React.FC<HomePageProps> = (props: HomePageProps) => {
  const { data, pageNumber, articlesPerPage, totalArticles, articles } = props;

  return (
    <Page>
      <HomeMeta data={data}/>

      {articles.map((article) => <ArticleCard article={article} key={article.slug}/>)}

      <Pagination pageNumber={pageNumber} articlesPerPage={articlesPerPage} totalArticles={totalArticles}/>
    </Page>
  );
};

export default HomePage;
