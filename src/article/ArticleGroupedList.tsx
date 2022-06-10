import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { ArticleData } from './types';
import { Typography } from '@mui/material';
import { Box, SxProps, SystemStyleObject, Theme } from '@mui/system';
import React from 'react';

type ArticleGroupedListProps = {
  sx?: SxProps<Theme>;
  articles: ArticleData[];
};

const ArticleGroupedList: React.FC<ArticleGroupedListProps> = ({
  sx = [],
  articles,
}: ArticleGroupedListProps) => {
  const groups = Object.entries(
    articles.reduce((groups, article) => {
      const date = new Date(article.date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
      });
      if (groups[date]) {
        groups[date].push(article);
      } else {
        groups[date] = [article];
      }
      return groups;
    }, {} as Record<string, ArticleData[]>),
  ).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Box
      sx={[
        {},
        ...((Array.isArray(sx) ? sx : [sx]) as SystemStyleObject<Theme>[]),
      ]}
    >
      {groups.map(([date, articles]) => (
        <Box key={date}>
          <Typography variant="h5">{date}</Typography>
          <ul>
            {articles.map((article) => (
              <li key={article.slug}>
                <InternalLink href={routerRedirects.article(article.slug)}>
                  {article.title}
                </InternalLink>
              </li>
            ))}
          </ul>
        </Box>
      ))}
    </Box>
  );
};

export default ArticleGroupedList;
