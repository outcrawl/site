import { Alert } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import React, { ReactNode } from 'react';

type MdxContentNoteProps = {
  sx?: SxProps<Theme>;
  children?: ReactNode;
};

const MdxContentNote: React.FC<MdxContentNoteProps> = ({
  sx,
  children,
}: MdxContentNoteProps) => (
  <Alert sx={sx} color="info" icon={false}>
    {children}
  </Alert>
);

export default MdxContentNote;
