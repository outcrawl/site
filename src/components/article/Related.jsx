import React from 'react';
import Link from 'gatsby-link';

import withStyles from '../ui/withStyles';
import shuffle from '../../utils/shuffle.js';

const styles = theme => ({
  articles: {
    textAlign: 'center'
  },
  link: {
    display: 'block',
    fontSize: '1.25rem'
  }
});

export default withStyles(styles)(({ classes, slug, articles }) => {
  articles = shuffle(articles)
    .filter(article => article.slug != slug)
    .slice(0, 3);

  return (
    <div className={classes.root}>
      <h1>Related</h1>
      <div className={classes.articles}>
        {articles.map(article => (
          <Link key={article.slug} className={classes.link} to={article.slug}>{article.title}</Link>
        ))}
      </div>
    </div>
  );
});
