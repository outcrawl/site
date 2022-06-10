import InternalLink from '../common/InternalLink';
import { Link as LinkIcon } from '@mui/icons-material';
import { Typography, TypographyProps } from '@mui/material';
import { SystemStyleObject, Theme } from '@mui/system';
import React from 'react';
import toSlug from 'slug';

type MdxContentHeadingProps = TypographyProps;

const MdxContentHeading: React.FC<MdxContentHeadingProps> = ({
  sx = [],
  variant,
  children,
  ...props
}: MdxContentHeadingProps) => {
  if (typeof children === 'string') {
    const id = toSlug(children, { lower: true });
    return (
      <Typography
        sx={[
          {
            '& a': {
              visibility: 'hidden',
            },
            '&:hover a': {
              visibility: 'visible',
            },
          },
          ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
        ]}
        id={id}
        variant={variant}
        {...props}
        gutterBottom
      >
        {children}
        <InternalLink href={`#${id}`}>
          <LinkIcon sx={{ verticalAlign: 'middle' }} color="inherit" />
        </InternalLink>
      </Typography>
    );
  } else {
    return (
      <Typography sx={sx} variant={variant} {...props} gutterBottom>
        {children}
      </Typography>
    );
  }
};

export default MdxContentHeading;
