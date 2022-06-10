import { LinkProps, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import React from 'react';

type InternalLinkProps = LinkProps;

const InternalLink: React.FC<InternalLinkProps> = ({
  href,
  ...props
}: InternalLinkProps) => (
  <Link href={href || '#'} passHref>
    <MuiLink color="secondary" underline="hover" {...props} />
  </Link>
);

export default InternalLink;
