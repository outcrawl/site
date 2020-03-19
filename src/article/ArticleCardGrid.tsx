import { Box } from '@material-ui/core';
import React from 'react';
import ArticleCard from './ArticleCard';
import { ArticleData, ArticleKind } from './types';

type ArticleCardGridProps = {
  articles: ArticleData[];
};

const ArticleCardGrid: React.FC<ArticleCardGridProps> = (props: ArticleCardGridProps) => {
  const { articles } = props;

  const maxInGroup = 3;
  const articleGroups: ArticleData[][] = articles.reduce((groups, article) => {
    if (article.kind == ArticleKind.Short) {
      const lastShortGroup = groups.findIndex(
        (group) => group.length < maxInGroup && group[0].kind == ArticleKind.Short,
      );
      if (lastShortGroup >= 0) {
        const updatedGroups = [...groups];
        updatedGroups[lastShortGroup] = [...updatedGroups[lastShortGroup], article];
        return updatedGroups;
      }
    }
    return [...groups, [article]];
  }, [] as ArticleData[][]);

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="space-between"
    >
      {articleGroups.map((articleGroup, i) => articleGroup[0].kind == ArticleKind.Standard ? (
        <Box
          key={articleGroup[0].slug}
          p={0.5}
          flexGrow={1}
          flexShrink={0}
          flexBasis="50%"
        >
          <ArticleCard article={articleGroup[0]}/>
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
            <Box
              key={article.slug}
              p={0.5}
              flexGrow={1}
              flexShrink={0}
            >
              <ArticleCard article={article}/>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ArticleCardGrid;
