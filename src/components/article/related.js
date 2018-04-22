import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';

const styles = (theme) => ({});

const ArticleRelated = ({ related, classes }) => (
  <section className="page__section">
    <h1 className="page__section__title">Related</h1>
    <ul className="page__related">
      {related.map((a) => (
        <li key={a.slug}>
          <Link to={a.slug}>{a.title}</Link>
        </li>
      ))}
    </ul>
  </section>
);

export default withStyles(styles)(ArticleRelated);
