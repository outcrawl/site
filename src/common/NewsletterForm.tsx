import { Button, FormGroup, TextField, Typography } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import React from 'react';

type NewsletterFormProps = {
  sx?: SxProps<Theme>;
};

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  sx = [],
}: NewsletterFormProps) => (
  <Box sx={sx} component="form">
    <Typography variant="body1">
      Join our newsletter for regular updates. No spam ever.
    </Typography>
    NewsletterForm
    <FormGroup row>
      <TextField label="Enter your email" />
      <Button color="primary">Subscribe</Button>
    </FormGroup>
  </Box>
);

export default NewsletterForm;
