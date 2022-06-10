import { LinkedIn } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type LinkedInButtonProps = {
  sx?: SxProps<Theme>;
  href: string;
};

const LinkedInButton: React.FC<LinkedInButtonProps> = ({
  sx = [],
  href,
}: LinkedInButtonProps) => (
  <Fab
    sx={[
      {
        color: '#fff',
        backgroundColor: '#2867B2',
        '&:hover': {
          backgroundColor: '#3C80D3',
        },
      },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
    href={href}
    size="small"
    rel="noopener noreferrer"
  >
    <LinkedIn fontSize="small" />
  </Fab>
);

export default LinkedInButton;
