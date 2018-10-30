import * as React from 'react';
import { format as dateFormat } from 'date-fns';

import { Article } from '../article';
import { Link } from 'gatsby';
import { createStyles, withStyles } from '@material-ui/core';

const styles = () => createStyles({
  date: {
    marginBottom: '1rem',
  },
});

interface AuthorArticlesProps {
  articles: Article[];
  classes?: {
    date: string;
  }
}

class AuthorArticles extends React.PureComponent<AuthorArticlesProps> {
  public render() {
    const { articles, classes } = this.props;

    const articlesByMonth = articles.reduce((g: any, a: Article) => {
      const key = dateFormat(a.date, 'MMMM, YYYY');
      (g[key] = g[key] || []).push(a);
      return g;
    }, {});

    return (
      <section>
        <h2>Articles</h2>
        {Object.keys(articlesByMonth).map((month) => (
          <div key={month}>
            <h4 className={classes.date}>{month}</h4>
            <ul>
              {articlesByMonth[month].map((a: Article) => (
                <li key={a.slug}>
                  <Link to={`/${a.slug}`}>{a.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    );
  }
}

export default withStyles(styles)(AuthorArticles);
