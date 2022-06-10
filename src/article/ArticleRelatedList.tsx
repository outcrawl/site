import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { ArticleData } from './types';
import { Typography } from '@mui/material';
import { Box, SxProps, Theme } from '@mui/system';
import React from 'react';

type ArticleRelatedListProps = {
  sx?: SxProps<Theme>;
  articles: ArticleData[];
};

const ArticleRelatedList: React.FC<ArticleRelatedListProps> = ({
  sx,
  articles,
}: ArticleRelatedListProps) => (
  <Box sx={sx} component="section">
    <Typography variant="h2" gutterBottom>
      Related
    </Typography>
    <Box sx={{ textAlign: 'center' }}>
      {articles.map((article) => (
        <Typography
          key={article.slug}
          sx={{
            fontSize: '1.5rem',
            marginBottom: '1rem',
          }}
          variant="h4"
        >
          <InternalLink
            key={article.slug}
            href={routerRedirects.article(article.slug)}
          >
            {article.title}
          </InternalLink>
        </Typography>
      ))}
    </Box>
  </Box>
);

export default ArticleRelatedList;
