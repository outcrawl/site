import React from 'react';
import Link from 'gatsby-link';
import { withStyles } from 'material-ui/styles';
import Divider from 'material-ui/Divider';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

import Page from '../components/Page';
import PageSection from '../components/PageSection';
import Entry from '../components/Entry';
import {
  TwitterIcon,
  GitHubIcon,
  FacebookIcon,
  GooglePlusIcon
} from '../components/Icons';

const styles = theme => ({
  icon: {
    width: 24,
    height: 24
  },
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
  },
  postDate: {
  }
});

const AuthorPage = props => {
  const { data, pathContext } = props;
  const author = pathContext.authorData;
  const classes = props.classes;

  const postsForDate = [];
  let lastDate = null;

  for ({ node } of data.allMarkdownRemark.edges) {
    const post = { ...node.frontmatter, ...node.fields };
    // Remove days
    const date = post.date.substr(3);
    if (lastDate == date) {
      postsForDate[postsForDate.length - 1].posts.push(post);
    } else {
      postsForDate.push({ date: date, posts: [post] });
      lastDate = date;
    }
  }

  const socialLinks = [];
  if (author.social.twitter) {
    socialLinks.push(
      <IconButton key="1" aria-label="Twitter"
        href={`https://twitter.com/${author.social.twitter}`}>
        <TwitterIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.github) {
    socialLinks.push(
      <IconButton key="2" aria-label="GitHub"
        href={`https://github.com/${author.social.github}`}>
        <GitHubIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.facebook) {
    socialLinks.push(
      <IconButton key="3" aria-label="Facebook"
        href={`https://www.facebook.com/${author.social.facebook}`}>
        <FacebookIcon className={classes.icon} />
      </IconButton>
    );
  }
  if (author.social.googlePlus) {
    socialLinks.push(
      <IconButton key="4" aria-label="Google+"
        href={`https://www.facebook.com/${author.social.googlePlus}`}>
        <GooglePlusIcon className={classes.icon} aria-label="Google+" />
      </IconButton>
    );
  }

  return (
    <Page contained={true}>
      <PageSection className={classes.profile}>
        <img
          alt={author.name}
          src={`https://www.gravatar.com/avatar/${author.emailHash}?size=512`}
          className={classes.avatar} />
        <h1 className={classes.name}>
          {author.name}
        </h1>
        <p className={classes.bio}>
          {author.bio}
        </p>
        <div className={classes.social}>
          {socialLinks}
        </div>
      </PageSection>
      <Divider light className={classes.divider} />
      <PageSection className={classes.articles}>
        <h2 className={classes.articlesTitle}>
          Articles
        </h2>
        {postsForDate.map(e =>
          <div key={e.date}>
            <h4 className={classes.postDate}>{e.date}</h4>
            <ul>
              {e.posts.map(post =>
                <li key={post.slug}>
                  <Link to={post.slug}>{post.title}</Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </PageSection>
    </Page>
  );
};

export default withStyles(styles)(AuthorPage);

export const pageQuery = graphql`
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
  }
`;
