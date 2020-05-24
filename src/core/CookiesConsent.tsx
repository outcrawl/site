import { Button, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles({
  root: {
    maxWidth: 256,
  },
});

const CONSENTED_STORAGE_KEY = 'cookies-consented';

const CookiesConsent: React.FC = () => {
  const [open, setOpen] = React.useState(localStorage.getItem(CONSENTED_STORAGE_KEY) !== 'true');
  const classes = useStyles();

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
