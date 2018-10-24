import * as React from 'react';
import { format as dateFormat } from 'date-fns';

import Article from '../article/article';
import { Link } from 'gatsby';

interface AuthorArticlesProps {
  articles: Article[];
}

class AuthorArticles extends React.PureComponent<AuthorArticlesProps> {
  public render() {
    const { articles } = this.props;

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
            <h4>{month}</h4>
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

export default AuthorArticles;
