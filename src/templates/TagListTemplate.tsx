import { graphql } from 'gatsby';
import React from 'react';
import { PageData, SiteMetadata } from '../core/types';
import TagListPage from '../tag/TagListPage';
import { TagData, TagGroup } from '../tag/types';

type TagListTemplateProps = {
  data: {
    articles: {
      edges: {
        node: {
          fields: {
            tags: TagData[];
          };
        };
      }[];
    };
    site: {
      siteMetadata: SiteMetadata;
    };
  };
};

const TagListTemplate: React.FC<TagListTemplateProps> = (props: TagListTemplateProps) => {
  const { data: { articles, site: { siteMetadata } } } = props;

  const tagGroupsBySlug = articles.edges.reduce((tagGroups, { node }) => {
    const tags = node.fields.tags;
    for (const tag of tags) {
      tagGroups[tag.slug] = {
        tag,
        size: (tagGroups[tag.slug]?.size || 0) + 1,
      };
    }
    return tagGroups;
  }, {} as Record<string, TagGroup>);
  const tagGroups = Object.values(tagGroupsBySlug)
    .sort((a, b) => b.size - a.size);

  const tagListPage: PageData = {
    title: 'Tags - ' + siteMetadata.title,
    description: siteMetadata.description + '.',
    url: siteMetadata.siteUrl + '/tags',
  };

  return <TagListPage tagListPage={tagListPage} tagGroups={tagGroups}/>;
};

export default TagListTemplate;

export const pageQuery = graphql`
  {
    articles: allMarkdownRemark(filter: { fields: { type: { eq: "article" } } }) {
      edges {
        node {
          fields {
            tags {
              title
              slug
            }
          }
        }
      }
    }
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
