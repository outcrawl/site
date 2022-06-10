import ExternalLink from '../common/ExternalLink';
import InternalLink from '../common/InternalLink';
import { loadConfig } from '../config';
import { routerRedirects } from '../routes';
import { Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Footer: React.FC = () => {
  const config = loadConfig();

  return (
    <Box component="footer" sx={{ backgroundColor: 'background.contrast' }}>
      <Container sx={{ py: 4 }} maxWidth="md">
        <Typography variant="h6" gutterBottom>
          {config.title}
        </Typography>
        <Typography
          variant="body1"
          component="div"
          sx={{
            '& ul': {
              margin: 0,
              paddingLeft: 0,
              listStyle: 'none',
            },
            '& li': {
              py: 0.5,
              '& a': {
                color: 'text.primary',
              },
            },
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={6}>
              <ul>
                <li>
                  <ExternalLink href="https://github.com/tinrab">
                    GitHub
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://twitter.com/tinrab">
                    Twitter
                  </ExternalLink>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ul>
                <li>
                  <InternalLink href={routerRedirects.about}>
                    About
                  </InternalLink>
                </li>
                <li>
                  <InternalLink href={routerRedirects.privacy}>
                    Privacy
                  </InternalLink>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            color: 'text.secondary',
          }}
        >
          {config.copyright}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
