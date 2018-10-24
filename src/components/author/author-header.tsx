import * as React from 'react';
import Author from './author';
import { createStyles, Theme, withStyles } from '@material-ui/core';

import { FacebookButton, GitHubButton, TwitterButton } from '../social-buttons';

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
  },
  avatar: {
    flex: '0 0 auto',
    borderRadius: '50%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    width: 140,
    height: 140,
    flexShrink: 0,
  },
  name: {
    fontSize: '2.75rem',
    margin: '0.4em 0 0.4em',
  },
  socialButton: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: 0,
    marginLeft: theme.spacing.unit,
  },
});

interface AuthorHeaderProps {
  author: Author;
  classes?: {
    root: string;
    avatar: string;
    name: string;
    socialButton: string;
  };
}

class AuthorHeader extends React.PureComponent<AuthorHeaderProps> {
  public render() {
    const { author, classes } = this.props;

    return (
      <section className={classes.root}>
        <img className={classes.avatar} src={author.avatar} alt={author.name}/>
        <h1 className={classes.name}>{author.name}</h1>
        <p>{author.bio}</p>
        <p>
          <a href={`mailto:${author.email}`}>{author.email}</a>
        </p>
        <div>
          {author.social.twitter && (
            <TwitterButton
              className={classes.socialButton}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              variant="fab"
              mini
              href={`https://twitter.com/${author.social.twitter}`}
              aria-label={`Find ${author.name} on Twitter`}/>
          )}
          {author.social.github && (
            <GitHubButton
              className={classes.socialButton}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              variant="fab"
              mini
              href={`https://github.com/${author.social.github}`}
              aria-label={`Find ${author.name} on GitHub`}/>
          )}
          {author.social.facebook && (
            <FacebookButton
              className={classes.socialButton}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              variant="fab"
              mini
              href={`https://facebook.com/${author.social.facebook}`}
              aria-label={`Find ${author.name} on Facebook`}/>
          )}
        </div>
      </section>
    );
  }
}

export default withStyles(styles)(AuthorHeader);
