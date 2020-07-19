import { Button, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles({
  root: {
    maxWidth: 256,
  },
});

const CONSENTED_STORAGE_KEY = 'cookies-consented';

const CookiesConsent: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  if (typeof window === 'undefined') {
    return <></>;
  }

  useEffect(() => {
    setOpen((prevState) => prevState !== undefined ? prevState : localStorage.getItem(CONSENTED_STORAGE_KEY) !== 'true');
  }, []);

  const handleClose = (): void => {
    localStorage.setItem(CONSENTED_STORAGE_KEY, 'true');
    setOpen(false);
  };

  return (
    <Snackbar
      className={classes.root}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      onClose={handleClose}
      message="We serve cookies on this site to analyze traffic, remember your preferences, and optimize your experience."
      action={
        <>
          <Button href="/privacy/#Cookies" color="inherit" onClick={handleClose}>
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

export default CookiesConsent;
