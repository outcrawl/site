import * as React from 'react';

import { Article } from '../article';
import Author from './author';
import Page from '../page/page';
import PageSection from '../page/page-section';
import AuthorHeader from './author-header';
import AuthorArticles from './author-articles';

interface AuthorPageProps {
  author: Author;
  articles: Article[];
}

class AuthorPage extends React.PureComponent<AuthorPageProps, {}> {
  public render() {
    const { author, articles } = this.props;

    return (
      <Page narrow>
        <PageSection>
          <AuthorHeader author={author}/>
        </PageSection>
        <PageSection>
          <AuthorArticles articles={articles}/>
        </PageSection>
      </Page>
    );
  }
}

export default AuthorPage;
