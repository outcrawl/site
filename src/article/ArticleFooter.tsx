import TagChip from '../tag/TagChip';
import ArticleShare from './ArticleShare';
import { ArticleData } from './types';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type ArticleFooterProps = { sx?: SxProps<Theme>; article: ArticleData };

const ArticleFooter: React.FC<ArticleFooterProps> = ({
  sx = [],
  article,
}: ArticleFooterProps) => (
  <Box
    sx={[
      (theme) => ({
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
        },
      }),
      ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
    ]}
    component="section"
  >
    <Box sx={{ display: 'flex', flexWrap: 'wrap', flexGrow: 1 }}>
      {article.tags.map((tag) => (
        <TagChip key={tag.slug} sx={{ mr: 1, mb: 0.5 }} tag={tag} />
      ))}
    </Box>
    <Box sx={{ flexShrink: 0 }}>
      <ArticleShare
        sx={(theme) => ({
          marginLeft: 'auto',
          [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
          },
        })}
        article={article}
      />
    </Box>
  </Box>
);

export default ArticleFooter;
