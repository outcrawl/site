import { Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';

const FooterLanguageSelect: React.FC = () => {
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(
    null,
  );
  const languageOpen = !!languageAnchor;

  const handleLanguageClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = (): void => {
    setLanguageAnchor(null);
  };

  return (
    <>
      <Button
        id="language-button"
        aria-controls={languageOpen ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={languageOpen ? 'true' : undefined}
        onClick={handleLanguageClick}
      >
        Lang
      </Button>
      <Menu
        id="language-menu"
        open={languageOpen}
        anchorEl={languageAnchor}
        onClose={handleLanguageClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        <MenuItem>
          <Link href="/">English</Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default FooterLanguageSelect;
