import { CODE_FONT_FAMILY } from '../theme';
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import React, { HTMLAttributes } from 'react';

type MdxInlineCodeProps = HTMLAttributes<HTMLElement>;

const MdxInlineCode: React.FC<MdxInlineCodeProps> = (
  props: MdxInlineCodeProps,
) => (
  <Box
    component="code"
    sx={{
      fontFamily: CODE_FONT_FAMILY,
      fontWeight: 400,
      fontSize: '0.875rem',
      padding: '1px .2em',
      borderRadius: '4px',
      backgroundColor: grey['100'],
    }}
    {...props}
  />
);

export default MdxInlineCode;
