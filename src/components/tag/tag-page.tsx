import * as React from 'react';
import Page from '../page/page';
import PageSection from '../page/page-section';
import { Tag } from './types';
import { Article } from '../article';
import ArticleCard from '../article/article-card';
import Pagination from '../home/pagination';

interface TagPageProps {
  tag: Tag;
  articles: Article[];
  articlesPerPage: number;
  page: number;
  totalArticles: number;
}

class TagPage extends React.PureComponent<TagPageProps> {
  public render() {
    const {
      tag,
      articles,
      articlesPerPage,
      page,
      totalArticles,
    } = this.props;

    return (
      <Page>
        <PageSection>
          <h1>{tag.title}</h1>
        </PageSection>

        {articles.map((a, i) => (
          <ArticleCard article={a} key={i}/>
        ))}

        <Pagination basePath={`/tags/${tag.slug}`}
                    articlesPerPage={articlesPerPage}
                    page={page}
                    totalArticles={totalArticles}/>
      </Page>
    );
  }
}

export default TagPage;
