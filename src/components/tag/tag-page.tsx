import * as React from 'react';
import Page from '../page/page';
import PageSection from '../page/page-section';
import { Tag, TagInfo } from './types';
import { Article } from '../article';
import ArticleCard from '../article/article-card';
import Pagination from '../home/pagination';
import TagMeta from './tag-meta';

interface TagPageProps {
  info: TagInfo;
  tag: Tag;
  articles: Article[];
  articlesPerPage: number;
  pageNumber: number;
  totalArticles: number;
}

class TagPage extends React.PureComponent<TagPageProps> {
  public render() {
    const {
      info,
      tag,
      articles,
      articlesPerPage,
      pageNumber,
      totalArticles,
    } = this.props;

    return (
      <Page>
        <TagMeta info={info}/>

        <PageSection>
          <h1>{tag.title}</h1>
        </PageSection>

        {articles.map((a, i) => (
          <ArticleCard article={a} key={i}/>
        ))}

        <Pagination basePath={`/tags/${tag.slug}`}
                    articlesPerPage={articlesPerPage}
                    pageNumber={pageNumber}
                    totalArticles={totalArticles}/>
      </Page>
    );
  }
}

export default TagPage;
