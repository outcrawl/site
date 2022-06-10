import InternalLink from '../common/InternalLink';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const FooterProductSection: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Typography variant="body2" sx={{ fontWeight: 700 }}>
      Product
    </Typography>
    <InternalLink href="#">Pricing</InternalLink>
    <InternalLink href="#">Enterprise</InternalLink>
    <InternalLink href="#">Changelog</InternalLink>
  </Box>
);

export default FooterProductSection;
