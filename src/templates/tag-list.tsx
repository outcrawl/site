import * as React from 'react';
import { TagGroup, TagListInfo, TagListPage } from '../components/tag-list';
import { graphql } from 'gatsby';

interface TagListTemplateProps {
  pathContext: {
    tagGroups: TagGroup[];
  };
  data: {
    site: any;
  };
}

class TagListTemplate extends React.PureComponent<TagListTemplateProps> {
  public render() {
    const { pathContext: { tagGroups }, data } = this.props;
    const meta = data.site.siteMetadata;

    const info: TagListInfo = {
      site: {
        title: meta.title,
        description: `${meta.description}.`,
        twitterId: meta.twitterId,
        facebookId: meta.facebookId,
      },
      title: `Tags - ${meta.title}`,
      description: `All tags found on ${meta.title}.`,
      url: `${meta.siteUrl}/tags`,
      image: {
        url: `${meta.siteUrl}/static/featured.jpg`,
        width: 1280,
        height: 1280,
      },
    };

    return <TagListPage info={info} tags={tagGroups}/>;
  }
}

export default TagListTemplate;

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
        description
        siteUrl
        twitterId
        facebookId
      }
    }
  }
`;
