import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { TagData } from './types';
import { Chip } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import React from 'react';

type TagChipProps = {
  sx?: SxProps<Theme>;
  tag: TagData;
};

const TagChip: React.FC<TagChipProps> = ({ sx = [], tag }: TagChipProps) => (
  <InternalLink
    sx={sx}
    href={routerRedirects.tags.tag(tag.slug).index}
    underline="none"
  >
    <Chip label={tag.title} clickable />
  </InternalLink>
);

export default TagChip;
