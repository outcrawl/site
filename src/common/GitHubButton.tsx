import { GitHub } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type GitHubButtonProps = { sx?: SxProps<Theme>; href: string };

const GitHubButton: React.FC<GitHubButtonProps> = ({
  sx = [],
  href,
}: GitHubButtonProps) => (
  <Fab
    sx={[
      {
        color: '#fff',
        backgroundColor: '#000000',
        '&:hover': {
          backgroundColor: '#1A1A1A',
        },
      },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
    href={href}
    size="small"
    rel="noopener noreferrer"
  >
    <GitHub fontSize="small" />
  </Fab>
);

export default GitHubButton;
