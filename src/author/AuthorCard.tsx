import React from 'react';
import { AuthorData } from './types';

type AuthorCardProps = {
  author: AuthorData;
};

const AuthorCard: React.FC<AuthorCardProps> = ({ author }: AuthorCardProps) => {
  return (
    <div>
      {author.name}
    </div>
  );
};

export default AuthorCard;
