import ExternalLink from '../common/ExternalLink';
import FacebookButton from '../common/FacebookButton';
import GitHubButton from '../common/GitHubButton';
import LinkedInButton from '../common/LinkedInButton';
import TwitterButton from '../common/TwitterButton';
import { AuthorData } from './types';
import { Badge, Typography } from '@mui/material';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type AuthorHeaderProps = {
  sx?: SxProps<Theme>;
  author: AuthorData;
};

const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  sx = [],
  author,
}: AuthorHeaderProps) => (
  <Box
    sx={[
      { textAlign: 'center' },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
  >
    <Badge
      color="error"
      overlap="circular"
      badgeContent="Hire me"
      invisible={!author.hire}
    >
      <Box
        component="img"
        sx={{
          borderRadius: '50%',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'divider',
          mb: 1,
        }}
        width={140}
        height={140}
        src={author.avatar}
        alt={author.name}
      />
    </Badge>
    <Typography variant="h2" variantMapping={{ h2: 'h1' }} gutterBottom>
      {author.name}
    </Typography>
    {author.email !== undefined ? (
      <Typography variant="body1" gutterBottom>
        <ExternalLink href={`mailto:${author.email}`}>
          {author.email}
        </ExternalLink>
      </Typography>
    ) : null}
    <Typography sx={{ mb: 1 }} variant="body1">
      {author.bio}
    </Typography>
    <Box>
      {author.social.github && (
        <GitHubButton
          sx={{ mx: 1 }}
          href={`https://github.com/${author.social.github}`}
        />
      )}
      {author.social.twitter && (
        <TwitterButton
          sx={{ mx: 1 }}
          href={`https://twitter.com/${author.social.twitter}`}
        />
      )}
      {author.social.linkedin && (
        <LinkedInButton
          sx={{ mx: 1 }}
          href={`https://www.linkedin.com/in/${author.social.linkedin}`}
        />
      )}
      {author.social.facebook && (
        <FacebookButton
          sx={{ mx: 1 }}
          href={`https://facebook.com/${author.social.facebook}`}
        />
      )}
    </Box>
  </Box>
);

export default AuthorHeader;
