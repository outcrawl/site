import React from 'react';
import { AuthorArticleData, AuthorData } from './types';

type AuthorPageProps = {
  author: AuthorData;
  articles: AuthorArticleData[];
}

const AuthorPage: React.FC<AuthorPageProps> = (props: AuthorPageProps) => {
  const { author } = props;

  return (
    <div>
      {author.name}
    </div>
  );
};

export default AuthorPage;
