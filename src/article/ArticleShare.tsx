import FacebookButton from '../common/FacebookButton';
import TwitterButton from '../common/TwitterButton';
import { ArticleData } from './types';
import { Box, SxProps, Theme } from '@mui/system';
import React from 'react';

type ArticleShareProps = {
  sx?: SxProps<Theme>;
  article: ArticleData;
};

const ArticleShare: React.FC<ArticleShareProps> = ({
  sx,
  article,
}: ArticleShareProps) => (
  <Box sx={sx}>
    <TwitterButton
      href={`https://twitter.com/intent/tweet?url=${article.url}&text=${article.title}`}
      aria-label="Share on Twitter"
    />
    <FacebookButton
      sx={{ ml: 1 }}
      href={`https://www.facebook.com/sharer/sharer.php?u=${article.url}`}
      aria-label="Share on Facebook"
    />
  </Box>
);

export default ArticleShare;
