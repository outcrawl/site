import React from 'react';

import TagsPage from '../components/tags-page';
import { getTagsPage } from '../utils/query';

export default ({ data, pathContext: { allTags } }) => {
  const tagsPage = getTagsPage(data);
  return <TagsPage page={tagsPage} tags={allTags} />;
};

export const query = graphql`
  query TagsPageQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;
