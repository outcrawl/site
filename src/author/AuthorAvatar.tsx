import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { AuthorData } from './types';
import { Avatar, Badge, Typography, badgeClasses } from '@mui/material';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type AuthorAvatarProps = {
  sx?: SxProps<Theme>;
  author: AuthorData;
  subtext?: string;
  disableHire?: boolean;
};

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({
  sx = [],
  author,
  subtext,
  disableHire,
}: AuthorAvatarProps) => (
  <Box
    sx={[
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
  >
    <Avatar
      sx={{
        flexShrink: 0,
        mr: 1,
      }}
      alt={author.name}
      src={author.avatar}
      variant="circular"
    />
    <Box>
      {disableHire ? (
        <InternalLink
          href={routerRedirects.author(author.slug)}
          color="primary"
        >
          {author.name}
        </InternalLink>
      ) : (
        <Badge
          sx={(theme) => ({
            [`& .${badgeClasses.badge}`]: {
              transform: 'scale(1) translateX(100%)',
              right: theme.spacing(-1),
            },
          })}
          color="error"
          overlap="rectangular"
          badgeContent="Hire me"
          invisible={!author.hire}
        >
          <InternalLink
            href={routerRedirects.author(author.slug)}
            color="primary"
          >
            {author.name}
          </InternalLink>
        </Badge>
      )}
      {subtext !== undefined ? (
        <Typography color="text.secondary" variant="body2">
          {subtext}
        </Typography>
      ) : null}
    </Box>
  </Box>
);

export default AuthorAvatar;
