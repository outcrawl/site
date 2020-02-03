import React from 'react';
import { ArticlePageData } from './types';

type ArticleFooterProps = {
  data: ArticlePageData;
} & React.HTMLAttributes<HTMLDivElement>;

const ArticleFooter: React.FC<ArticleFooterProps> = (props: ArticleFooterProps) => {
  const { data, className } = props;

  return (
    <section className={className}>
      Footer
    </section>
  );
};

export default ArticleFooter;
