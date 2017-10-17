import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import withStyles from '../components/ui/withStyles';
import Divider from '../components/ui/Divider';
import IconButton from '../components/ui/IconButton';
import Page from '../components/Page';
import PageSection from '../components/PageSection';
import {
  TwitterIcon,
  GitHubIcon,
  FacebookIcon,
  GooglePlusIcon
} from '../components/Icons';
import { SiteMeta, PageMeta } from '../components/Meta';

const styles = theme => ({
  profile: {
    textAlign: 'center',
    paddingBottom: 24
  },
  name: {
    margin: [16, 0],
    color: theme.palette.text.primary,
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: 0
  },
  bio: {
    margin: [8, 0]
  },
  divider: {
    width: '100%'
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: '50%',
    border: [1, 'solid', theme.palette.text.divider]
  },
  articles: {
    paddingTop: 24
  },
  articlesTitle: {
    margin: 0
  }
});

export default withStyles(styles)(({ classes, data, pathContext }) => {
  const author = pathContext.authorData;
  author.slug = pathContext.author;
  const siteMeta = data.site.siteMetadata;

  const articlesForDate = [];
  let lastDate = null;
  for ({ node } of data.allMarkdownRemark.edges) {
    const article = { ...node.frontmatter, ...node.fields };
    // Remove days
    const date = article.date.substr(3);
    if (lastDate == date) {
      articlesForDate[articlesForDate.length - 1].articles.push(article);
    } else {
      articlesForDate.push({ date: date, articles: [article] });
      lastDate = date;
    }
  }

  const socialLinks = [];
  if (author.social.twitter) {
    socialLinks.push(
      <IconButton key="1"
        href={`https://twitter.com/${author.social.twitter}`}>
        <TwitterIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.github) {
    socialLinks.push(
      <IconButton key="2"
        href={`https://github.com/${author.social.github}`}>
        <GitHubIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.facebook) {
    socialLinks.push(
      <IconButton key="3"
        href={`https://www.facebook.com/${author.social.facebook}`}>
        <FacebookIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.googlePlus) {
    socialLinks.push(
      <IconButton key="4"
        href={`https://plus.google.com/${author.social.googlePlus}`}>
        <GooglePlusIcon className={classes.icon} />
      </IconButton>
    );
  }

  return (
    <Page narrow>
      <SiteMeta siteMeta={siteMeta} />
      <PageMeta
        siteMeta={siteMeta}
        title={`${author.name} - ${siteMeta.title}`}
        description={author.bio}
        url={siteMeta.siteUrl + `/authors/${author.slug}/`}
      />

      <PageSection className={classes.profile}>
        <img
          alt={author.name}
          src={`https://www.gravatar.com/avatar/${author.emailHash}?size=512`}
          className={classes.avatar} />
        <h1 className={classes.name}>{author.name}</h1>
        <p className={classes.bio}>{author.bio}</p>
        <a href={`mailto:${author.email}`}>{author.email}</a>
        <div className={classes.social}>{socialLinks}</div>
      </PageSection>

      <Divider light className={classes.divider} />

      <PageSection className={classes.articles}>
        <h2 className={classes.articlesTitle}>Articles</h2>
        {articlesForDate.map(e =>
          <div key={e.date}>
            <h4>{e.date}</h4>
            <ul>
              {e.articles.map(article =>
                <li key={article.slug}>
                  <Link to={article.slug}>{article.title}</Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </PageSection>

    </Page>
  );
});

export const query = graphql`
query AuthorPageQuery($author: String!) {
  allMarkdownRemark(filter: {frontmatter: {author: {eq: $author}}}, sort: {fields: [frontmatter___date], order: DESC}) {
    edges {
      node {
        frontmatter {
          title
          tags
          date(formatString: "DD MMMM, YYYY")
        }
        fields {
          slug
          slugTags
        }
      }
    }
  }

  site {
    siteMetadata {
      title
      description
      siteUrl
      facebookPublisherUrl
    }
  }
}
`;
