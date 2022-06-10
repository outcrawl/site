import { Twitter } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type TwitterButtonProps = {
  sx?: SxProps<Theme>;
  href: string;
};

const TwitterButton: React.FC<TwitterButtonProps> = ({
  sx = [],
  href,
}: TwitterButtonProps) => (
  <Fab
    sx={[
      {
        color: '#fff',
        backgroundColor: '#00aced',
        '&:hover': {
          backgroundColor: '#1FC3FF',
        },
      },
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
    href={href}
    size="small"
    rel="noopener noreferrer"
  >
    <Twitter fontSize="small" />
  </Fab>
);

export default TwitterButton;
