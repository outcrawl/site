import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';

import AuthorInfo from './info';
import { Page, PageSection } from '../page';

const styles = (theme) => ({
  info: {},
});

const Articles = ({ articlesByMonth }) => (
  <section>
    <h2>Articles</h2>
    {Object.keys(articlesByMonth).map((month) => (
      <div key={month}>
        <h3>{month}</h3>
        <ul>
          {articlesByMonth[month].map((a) => (
            <li key={a.slug}>
              <Link to={`/${a.slug}`}>{a.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

const AuthorPage = ({ author, articles, classes }) => (
  <Page narrow>
    <PageSection>
      <AuthorInfo author={author} classes={classes} />
    </PageSection>
    <PageSection>
      <Articles articlesByMonth={author.articlesByMonth} />
    </PageSection>
  </Page>
);

export default withStyles(styles)(AuthorPage);
