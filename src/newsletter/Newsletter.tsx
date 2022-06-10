import ExternalLink from '../common/ExternalLink';
import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { newsletterApi } from './api';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React, { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

type NewsletterProps = {
  sx?: SxProps<Theme>;
};

type NewsletterState = {
  snackbar: {
    open: boolean;
    message: string;
    error: boolean;
  };
  email: string;
  agree: boolean;
};

const Newsletter: React.FC<NewsletterProps> = ({
  sx = [],
}: NewsletterProps) => {
  const [state, setState] = useState<NewsletterState>({
    snackbar: {
      open: false,
      message: '',
      error: false,
    },
    email: '',
    agree: false,
  });
  const captchaRef = useRef<ReCAPTCHA>(null);

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value = event.target?.value.trim() || '';
    setState((prevState) => ({
      ...prevState,
      email: value,
    }));
  };

  const handleAgreeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
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

  const handleSnackbarClose = (): void => {
    setState((prevState) => ({
      ...prevState,
      snackbar: {
        ...prevState.snackbar,
        open: false,
      },
    }));
  };

  const handleCaptchaChange = (value: string | null): void => {
    if (!value) {
      return;
    }
    if (state.email === '' || !state.agree) {
      return;
    }
    newsletterApi
      .subscribe(state.email, value)
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

  return (
    <Box
      sx={[
        {
          '& .grecaptcha-badge': {
            display: 'none',
          },
        },
        ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
      ]}
    >
      <Typography variant="h2" gutterBottom>
        Newsletter
      </Typography>
      <Typography
        sx={{
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: 300,
        }}
        variant="h5"
      >
        Get awesome articles delivered right to your doorstep
      </Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        autoComplete="on"
        onSubmit={handleSubscribe}
      >
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
            sx={(theme) => ({
              ml: 1,
              [theme.breakpoints.down('xs')]: {
                marginLeft: 0,
              },
            })}
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
          label={
            <span>
              I agree to Outcrawl&apos;s{' '}
              <InternalLink href={routerRedirects.privacy}>
                Privacy Policy
              </InternalLink>
              .
            </span>
          }
        />
      </Box>
      <ReCAPTCHA
        ref={captchaRef}
        onChange={handleCaptchaChange}
        size="invisible"
        sitekey="6LcCEDEUAAAAAKvjiu87ZjZn7FZOX4LI-7tKyOLW"
        badge="inline"
      />
      <Typography
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
        }}
        variant="body2"
      >
        Protected by reCAPTCHA -{' '}
        <ExternalLink href="https://www.google.com/intl/en/policies/privacy/">
          Privacy
        </ExternalLink>{' '}
        -{' '}
        <ExternalLink href="https://www.google.com/intl/en/policies/terms/">
          Terms
        </ExternalLink>
      </Typography>
      <Snackbar
        autoHideDuration={3000}
        open={state.snackbar.open}
        onClose={handleSnackbarClose}
      >
        <Alert
          variant="filled"
          severity={state.snackbar.error ? 'error' : 'success'}
        >
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Newsletter;
