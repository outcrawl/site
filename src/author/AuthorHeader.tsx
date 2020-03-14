import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AuthorData } from './types';
import { Box, Typography } from '@material-ui/core';
import FacebookButton from '../assets/FacebookButton';
import TwitterButton from '../assets/TwitterButton';
import GitHubButton from '../assets/GitHubButton';
import LinkedinButton from '../assets/LinkedinButton';

const useStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    borderRadius: '50%',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    marginBottom: theme.spacing(1),
  },
  title: {
    fontSize: theme.typography.h2.fontSize,
    marginBottom: '0.25em',
  },
  bio: {
    marginBottom: '1em',
  },
  socialButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

type AuthorHeaderProps = {
  author: AuthorData;
};

const AuthorHeader: React.FC<AuthorHeaderProps> = (props: AuthorHeaderProps) => {
  const { author } = props;
  const classes = useStyles();

  return (
    <Box textAlign="center">
      <img className={classes.avatar} width={140} height={140} src={author.avatar} alt={author.name}/>
      <Typography className={classes.title} variant="h1">{author.name}</Typography>
      <Typography className={classes.bio} variant="body1">{author.bio}</Typography>
      <Box>
        {author.social.github && (
          <GitHubButton
            className={classes.socialButton}
            href={`https://github.com/${author.social.github}`}
          />
        )}
        {author.social.twitter && (
          <TwitterButton
            className={classes.socialButton}
            href={`https://twitter.com/${author.social.twitter}`}
          />
        )}
        {author.social.linkedin && (
          <LinkedinButton
            className={classes.socialButton}
            href={`https://www.linkedin.com/in/${author.social.linkedin}`}
          />
        )}
        {author.social.facebook && (
          <FacebookButton
            className={classes.socialButton}
            href={`https://facebook.com/${author.social.facebook}`}
          />
        )}
      </Box>
    </Box>
  );
};

export default AuthorHeader;
