import InternalLink from '../common/InternalLink';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const FooterCompanySection: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      Company
    </Typography>
    <InternalLink href="#">About</InternalLink>
    <InternalLink href="#">Blog</InternalLink>
  </Box>
);

export default FooterCompanySection;
