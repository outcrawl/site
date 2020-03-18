import {
  Box,
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import classNames from 'classnames';
import { Link } from 'gatsby';
import * as React from 'react';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import newsletterApi from './newsletter-api';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& .grecaptcha-badge': {
      display: 'none',
    },
  },
  lead: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontWeight: 300,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  subscribeButton: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
    },
  },
  captchaNote: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
  },
}));

type NewsletterProps = React.HTMLAttributes<HTMLElement>;

type NewsletterState = {
  snackbar: {
    open: boolean;
    message: string;
    error: boolean;
  };
  email: string;
  agree: boolean;
};

const Newsletter: React.FC<NewsletterProps> = (props: NewsletterProps) => {
  const { className } = props;
  const classes = useStyles();

  const [state, setState] = useState<NewsletterState>({
    snackbar: {
      open: false,
      message: '',
      error: false,
    },
    email: '',
    agree: false,
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target?.value.trim() || '';
    setState((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const handleAgreeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target?.checked || false;
    setState((prevState) => ({
      ...prevState,
      agree: value,
    }));
  };

  const showSnackbar = (message: string, error = false): void => {
    setState((prevState) => ({
      ...prevState,
      snackbar: {
        open: true,
        message,
        error,
      },
    }));
  };

  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleCaptchaChange = (value: string | null): void => {
    if (!value) {
      return;
    }
    if (state.email === '' || !state.agree) {
      return;
    }
    newsletterApi.subscribe(state.email, value)
      .then((response: Response) => {
        if (response.ok) {
          showSnackbar('You have subscribed!');
        } else {
          showSnackbar('Something bad happened.', true);
        }
        captchaRef.current?.reset();
      })
      .catch(() => {
        showSnackbar('Something bad happened.', true);
        captchaRef.current?.reset();
      });
  };

  const handleSubscribe = (event: React.FormEvent): void => {
    event.preventDefault();
    if (state.email === '' || !state.agree) {
      return;
    }
    captchaRef.current?.execute();
  };

  const handleSnackbarClose = (): void => {
    setState((prevState) => ({
      ...prevState,
      snackbar: {
        ...prevState.snackbar,
        open: false,
      },
    }));
  };

  return (
    <Box className={classNames(classes.root, className)} component="section">
      <Typography variant="h2" gutterBottom>Newsletter</Typography>
      <Typography className={classes.lead} variant="h5">
        Get awesome articles delivered right to your doorstep
      </Typography>
      <form className={classes.form} autoComplete="on" onSubmit={handleSubscribe}>
        <FormGroup row>
          <TextField
            required
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            placeholder="Email"
            autoComplete="email"
            margin="none"
          />
          <Button
            className={classes.subscribeButton}
            color="primary"
            variant="contained"
            disabled={!state.agree || state.email === ''}
            type="submit"
          >
            Subscribe
          </Button>
        </FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={state.agree}
              onChange={handleAgreeChange}
              color="primary"
            />
          }
          label={<span>I agree to Outcrawl&apos;s <Link to="/privacy">Privacy Policy</Link>.</span>}
        />
      </form>
      <ReCAPTCHA
        ref={captchaRef}
        onChange={handleCaptchaChange}
        size="invisible"
        sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
        badge="inline"
      />
      <Typography className={classes.captchaNote} variant="body2">
        Protected by reCAPTCHA - <a href="https://www.google.com/intl/en/policies/privacy/">Privacy</a> - <a
        href="https://www.google.com/intl/en/policies/terms/">Terms</a>
      </Typography>
      <Snackbar autoHideDuration={3000} open={state.snackbar.open} onClose={handleSnackbarClose}>
        <Alert variant="filled" severity={state.snackbar.error ? 'error' : 'success'}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Newsletter;
