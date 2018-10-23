import * as React from 'react';
import { Article, ArticleCard } from '../article';
import { Page } from '../page';
import Pagination from './pagination';

interface HomePageProps {
  page: number;
  articlesPerPage: number;
  totalArticles: number;
  articles: Article[];
}

class HomePage extends React.PureComponent<HomePageProps, {}> {
  public render() {
    const { page, articlesPerPage, totalArticles, articles } = this.props;

    return (
      <Page>
        {articles.map((article) => <ArticleCard article={article} key={article.slug}/>)}
        <Pagination page={page} articlesPerPage={articlesPerPage} totalArticles={totalArticles}/>
      </Page>
    );
  }
}

export default HomePage;
