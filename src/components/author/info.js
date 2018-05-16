import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
  TwitterButton,
  GitHubButton,
  FacebookButton,
  GooglePlusButton,
} from '../social-buttons';

const styles = (theme) => ({
  root: {
    textAlign: 'center',
  },
  avatar: {
    flex: '0 0 auto',
    borderRadius: '50%',
    border: [[1, 'solid', theme.palette.divider]],
    width: 140,
    height: 140,
    flexShrink: 0,
  },
  name: {
    fontSize: '2.75rem',
    margin: '0.4em 0 0.4em',
  },
  socialButton: {
    margin: [[theme.spacing.unit, theme.spacing.unit, 0, theme.spacing.unit]],
  },
});

const AuthorInfo = ({ author, classes }) => (
  <section className={classes.root}>
    <img
      className={classes.avatar}
      src={`https://www.gravatar.com/avatar/${author.emailHash}?s=512`}
      alt={author.name}
    />
    <h1 className={classes.name}>{author.name}</h1>
    <p>{author.bio}</p>
    <p>
      <a href={`mailto:${author.email}`}>{author.email}</a>
    </p>
    <div className={classes.social}>
      {author.social.twitter && (
        <TwitterButton
          className={classes.socialButton}
          component="a"
          variant="fab"
          mini
          href={`https://twitter.com/${author.social.twitter}`}
          aria-label={`Find ${author.name} on Twitter`}
        />
      )}
      {author.social.github && (
        <GitHubButton
          className={classes.socialButton}
          component="a"
          variant="fab"
          mini
          href={`https://github.com/${author.social.github}`}
          aria-label={`Find ${author.name} on GitHub`}
        />
      )}
      {author.social.facebook && (
        <FacebookButton
          className={classes.socialButton}
          component="a"
          variant="fab"
          mini
          href={`https://www.facebook.com/${author.social.facebook}`}
          aria-label={`Find ${author.name} on Facebook`}
        />
      )}
      {author.social.googlePlus && (
        <GooglePlusButton
          className={classes.socialButton}
          component="a"
          variant="fab"
          mini
          href={`https://plus.google.com/${author.social.googlePlus}`}
          aria-label={`Find ${author.name} on Google+`}
        />
      )}
    </div>
  </section>
);

export default withStyles(styles)(AuthorInfo);
