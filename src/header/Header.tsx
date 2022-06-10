import LogoText from '../assets/logo-text.svg';
import InternalLink from '../common/InternalLink';
import { AppBar, Toolbar } from '@mui/material';
import React from 'react';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="default" square elevation={0}>
      <Toolbar>
        <InternalLink
          sx={{
            height: 30,
          }}
          href="/"
        >
          <LogoText height="30" />
        </InternalLink>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
