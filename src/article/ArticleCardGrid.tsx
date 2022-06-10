import ArticleAvatar from './ArticleCard';
import { ArticleData, ArticleKind } from './types';
import { Box } from '@mui/system';
import React from 'react';

type ArticleCardGridProps = {
  articles: ArticleData[];
};

const ArticleCardGrid: React.FC<ArticleCardGridProps> = ({
  articles,
}: ArticleCardGridProps) => {
  const maxInGroup = 3;
  const articleGroups: ArticleData[][] = articles.reduce((groups, article) => {
    if (article.kind == ArticleKind.SHORT) {
      const lastShortGroup = groups.findIndex(
        (group) =>
          group.length < maxInGroup && group[0].kind == ArticleKind.SHORT,
      );
      if (lastShortGroup >= 0) {
        const updatedGroups = [...groups];
        updatedGroups[lastShortGroup] = [
          ...updatedGroups[lastShortGroup],
          article,
        ];
        return updatedGroups;
      }
    }
    return [...groups, [article]];
  }, [] as ArticleData[][]);

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between">
      {articleGroups.map((articleGroup, i) =>
        articleGroup[0].kind === ArticleKind.STANDARD ? (
          <Box
            key={articleGroup[0].slug}
            p={1}
            flexGrow={1}
            flexShrink={0}
            flexBasis="50%"
          >
            <ArticleAvatar article={articleGroup[0]} />
          </Box>
        ) : (
          <Box
            key={`group-${i}`}
            display="flex"
            flexDirection="column"
            flexGrow={1}
            flexShrink={0}
            flexBasis="50%"
          >
            {articleGroup.map((article) => (
              <Box key={article.slug} p={1} flexGrow={1} flexShrink={0}>
                <ArticleAvatar article={article} />
              </Box>
            ))}
          </Box>
        ),
      )}
    </Box>
  );
};

export default ArticleCardGrid;
