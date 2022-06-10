import InternalLink from './InternalLink';
import { Button, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';

const CONSENTED_STORAGE_KEY = 'cookies-consented';

const CookieConsent: React.FC = () => {
  const [open, setOpen] = useState<boolean | undefined>();

  useEffect(() => {
    setOpen((prevState) =>
      prevState !== undefined
        ? prevState
        : localStorage.getItem(CONSENTED_STORAGE_KEY) !== 'true',
    );
  }, []);

  const handleClose = (): void => {
    localStorage.setItem(CONSENTED_STORAGE_KEY, 'true');
    setOpen(false);
  };

  // if (typeof window === 'undefined') {
  //   return <></>;
  // }

  return (
    <Snackbar
      sx={{ maxWidth: 256 }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      onClose={handleClose}
      message="We serve cookies on this site to analyze traffic, remember your preferences, and optimize your experience."
      action={
        <>
          <Button
            component={InternalLink}
            href="/privacy/#cookies"
            color="inherit"
            onClick={handleClose}
          >
            More
          </Button>
          <Button color="inherit" onClick={handleClose}>
            OK
          </Button>
        </>
      }
    />
  );
};

export default CookieConsent;
