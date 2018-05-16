import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from '@material-ui/core/styles';

import { TagsPageMeta } from './meta';
import { Page, PageSection } from './page';

const styles = (theme) => ({
  tag: {
    marginRight: '0.4em',
    display: 'inline-block',
  },
});

const TagsPage = ({ page, tags, classes }) => {
  tags = tags.map((tag) => ({
    ...tag,
    fontSize: Math.max(Math.log(tag.count * 30 / tags[0].count), 1),
  }));

  return (
    <Page narrow>
      <TagsPageMeta page={page} />

      <PageSection component="section">
        <h1>Tags</h1>
        <p>
          {tags.map((tag) => (
            <Link
              className={classes.tag}
              key={tag.slug}
              style={{ fontSize: `${tag.fontSize}rem` }}
              to={`/tags/${tag.slug}`}
            >
              {tag.name}
            </Link>
          ))}
        </p>
      </PageSection>
    </Page>
  );
};

export default withStyles(styles)(TagsPage);
