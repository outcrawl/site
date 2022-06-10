import { Link, LinkProps } from '@mui/material';
import React from 'react';

type ExternalLinkProps = LinkProps;

const ExternalLink: React.FC<ExternalLinkProps> = (
  props: ExternalLinkProps,
) => (
  <Link
    color="secondary"
    underline="hover"
    {...props}
    target="_blank"
    rel="noopener"
  />
);

export default ExternalLink;
