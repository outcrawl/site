import { Facebook } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type FacebookButtonProps = {
  sx?: SxProps<Theme>;
  href: string;
};

const FacebookButton: React.FC<FacebookButtonProps> = ({
  sx = [],
  href,
}: FacebookButtonProps) => (
  <Fab
    sx={[
      {
        color: '#fff',
        backgroundColor: '#3b5998',
        '&:hover': {
          backgroundColor: '#4B6EB9',
        },
      },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
    href={href}
    size="small"
    rel="noopener noreferrer"
  >
    <Facebook fontSize="small" />
  </Fab>
);

export default FacebookButton;
