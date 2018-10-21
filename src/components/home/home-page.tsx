import * as React from 'react';
import { Article, ArticleCard } from '../article';
import { Page } from '../page';

interface HomePageProps {
  articles: Article[];
  totalArticles: number;
  articlesPerPage: number;
}

class HomePage extends React.PureComponent<HomePageProps, {}> {
  public render() {
    const articles = this.props.articles;

    return (
      <Page>
        {articles.map((article) => <ArticleCard article={article} key={article.slug}/>)}
      </Page>
    );
  }
}

export default HomePage;
