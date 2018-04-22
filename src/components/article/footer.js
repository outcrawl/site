import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';

import ArticleShare from './share';

const styles = (theme) => ({});

const ArticleFooter = ({ article, classes }) => (
  <section className="page__meta">
    <div className="page__tags">
      {article.tags.map((tag) => (
        <Link className="tag" key={tag.slug} to={`/tags/${tag.slug}`}>
          {tag.name}
        </Link>
      ))}
    </div>
    <ArticleShare article={article} />
  </section>
);

export default withStyles(styles)(ArticleFooter);
