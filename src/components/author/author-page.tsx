import * as React from 'react';

import { Article } from '../article';
import { Author, AuthorInfo } from './types';
import Page from '../page/page';
import PageSection from '../page/page-section';
import AuthorHeader from './author-header';
import AuthorArticles from './author-articles';
import AuthorMeta from './author-meta';

interface AuthorPageProps {
  info: AuthorInfo;
  author: Author;
  articles: Article[];
}

class AuthorPage extends React.PureComponent<AuthorPageProps, {}> {
  public render() {
    const { info, author, articles } = this.props;

    return (
      <Page narrow>
        <AuthorMeta info={info} author={author}/>

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
