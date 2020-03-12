import * as React from 'react';
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
import Alert from '@material-ui/lab/Alert';
import { Link } from 'gatsby';
import ReCAPTCHA from 'react-google-recaptcha';
import { makeStyles } from '@material-ui/core/styles';
import { useRef, useState } from 'react';
import newsletterApi from './newsletter-api';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: 0,
    paddingRight: 0,
  },
  content: {
    textAlign: 'center',
    '& .grecaptcha-badge': {
      display: 'none',
    },
  },
  form: {
    display: 'inline-block',
  },
  lead: {
    fontSize: '1.5rem',
    fontWeight: 300,
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    marginLeft: 0,
    marginRight: 0,
  },
  captchaNote: {
    fontSize: 13,
    color: theme.palette.text.secondary,
    padding: '8px 0px',
  },
  privacyNote: {
    fontSize: 16,
  },
  emailField: {
    verticalAlign: 'middle',
  },
  subscribeButton: {
    marginLeft: 8,
  },
}));

type NewsletterState = {
  snackbar: {
    open: boolean;
    message: string;
    error: boolean;
  };
  email: string;
  agree: boolean;
};

const Newsletter: React.FC = () => {
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
    <Box component="section">
      <Typography variant="h2">Newsletter</Typography>
      <div className={classes.content}>
        <p className={classes.lead}>
          Get awesome articles delivered right to your doorstep
        </p>
        <form autoComplete="on" onSubmit={handleSubscribe}>
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
          <FormGroup row>
            <TextField
              className={classes.emailField}
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
        </form>
        <ReCAPTCHA
          ref={captchaRef}
          onChange={handleCaptchaChange}
          size="invisible"
          sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
          badge="inline"
        />
        <div className={classes.captchaNote}>
          Protected by reCAPTCHA - <a href="https://www.google.com/intl/en/policies/privacy/">Privacy</a> - <a
          href="https://www.google.com/intl/en/policies/terms/">Terms</a>
        </div>
      </div>
      <Snackbar autoHideDuration={3000} open={state.snackbar.open} onClose={handleSnackbarClose}>
        <Alert variant="filled" severity={state.snackbar.error ? 'error' : 'success'}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Newsletter;
