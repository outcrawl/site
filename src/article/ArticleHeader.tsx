import AuthorAvatar from '../author/AuthorAvatar';
import ArticleShare from './ArticleShare';
import { ArticleData } from './types';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type ArticleHeaderProps = {
  sx?: SxProps<Theme>;
  article: ArticleData;
};

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  sx = [],
  article,
}: ArticleHeaderProps) => (
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
    {article.author !== undefined ? (
      <AuthorAvatar author={article.author} subtext={article.date} />
    ) : null}
    <ArticleShare
      sx={(theme) => ({
        display: 'flex',
        marginLeft: 'auto',
        [theme.breakpoints.down('xs')]: {
          marginLeft: 0,
          mt: 1,
        },
      })}
      article={article}
    />
  </Box>
);

export default ArticleHeader;
