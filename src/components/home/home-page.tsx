import * as React from 'react';
import { Article, ArticleCard } from '../article';
import Pagination from './pagination';
import { Page } from '../page';
import HomeMeta from './home-meta';
import { HomeInfo } from './types';

interface HomePageProps {
  info: HomeInfo;
  pageNumber: number;
  articlesPerPage: number;
  totalArticles: number;
  articles: Article[];
}

class HomePage extends React.PureComponent<HomePageProps, {}> {
  public render() {
    const { info, pageNumber, articlesPerPage, totalArticles, articles } = this.props;

    return (
      <Page>
        <HomeMeta info={info}/>

        {articles.map((article) => <ArticleCard article={article} key={article.slug}/>)}
        <Pagination pageNumber={pageNumber} articlesPerPage={articlesPerPage} totalArticles={totalArticles}/>
      </Page>
    );
  }
}

export default HomePage;
