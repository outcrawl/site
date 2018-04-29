import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui';

import { AuthorMeta } from '../meta';
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

const AuthorPage = ({ authorPage, classes }) => {
  const author = authorPage.author;

  return (
    <Page narrow>
      <AuthorMeta page={authorPage} />

      <PageSection>
        <AuthorInfo author={author} classes={classes} />
      </PageSection>
      <PageSection>
        <Articles articlesByMonth={authorPage.articlesByMonth} />
      </PageSection>
    </Page>
  );
};

export default withStyles(styles)(AuthorPage);
