import * as React from 'react';

import { Article } from '../article';
import { Author } from './author';

interface AuthorPageProps {
  author: Author;
  articles: Article[];
}

export class AuthorPage extends React.PureComponent<AuthorPageProps, {}> {
  public render() {
    const author = this.props.author;

    return (
      <div>{author.name}</div>
    );
  }
}
