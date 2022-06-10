import ExternalIconButtonLink from '../common/ExternalIconButtonLink';
import {
  Facebook as FacebookIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { Box } from '@mui/system';
import React from 'react';

const FooterSocialLinkList: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
    <ExternalIconButtonLink href="#">
      <TwitterIcon fontSize="inherit" />
    </ExternalIconButtonLink>
    <ExternalIconButtonLink href="#">
      <FacebookIcon fontSize="inherit" />
    </ExternalIconButtonLink>
    <ExternalIconButtonLink href="https://github.com/flinect">
      <GitHubIcon fontSize="inherit" />
    </ExternalIconButtonLink>
  </Box>
);

export default FooterSocialLinkList;
