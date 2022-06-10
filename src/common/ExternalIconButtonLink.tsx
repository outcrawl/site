import { IconButton, IconButtonProps } from '@mui/material';
import React from 'react';

type ExternalIconButtonLinkProps = IconButtonProps<'a'>;

const ExternalIconButtonLink: React.FC<ExternalIconButtonLinkProps> = (
  props: ExternalIconButtonLinkProps,
) => <IconButton component="a" {...props} target="_blank" rel="noopener" />;

export default ExternalIconButtonLink;
