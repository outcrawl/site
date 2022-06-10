import Page from '../common/Page';
import MdxContent from '../mdx/MdxContent';
import Newsletter from '../newsletter/Newsletter';
import ArticleFooter from './ArticleFooter';
import ArticleHeader from './ArticleHeader';
import ArticleMeta from './ArticleMeta';
import ArticleRelatedList from './ArticleRelatedList';
import { ArticleData } from './types';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import ExportedImage from 'next-image-export-optimizer';
import React from 'react';

type ArticlePageProps = {
  article: ArticleData;
  related: ArticleData[];
};

const ArticlePage: React.FC<ArticlePageProps> = ({
  article,
  related,
}: ArticlePageProps) => (
  <Page narrow>
    <ArticleMeta article={article} />
    <article>
      <Typography variant="h1" gutterBottom>
        {article.title}
      </Typography>
      <ArticleHeader
        sx={{
          mb: 2,
        }}
        article={article}
      />
      {article.cover !== undefined ? (
        <Box sx={{ mb: 1 }}>
          <ExportedImage
            src={article.cover.path}
            width={article.cover.width}
            height={article.cover.height}
            alt={article.title}
            layout="responsive"
            objectFit="cover"
          />
        </Box>
      ) : null}
      {article.content !== undefined ? (
        <MdxContent
          source={article.content}
          components={{
            img: ({ src, alt, width, height }) => {
              if (src === undefined) {
                throw new Error('Missing image src');
              }
              if (src.indexOf('/') !== -1) {
                src = src.substring(src.indexOf('/') + 1);
              }
              return (
                <ExportedImage
                  src={`${article.assetPath}/${src}`}
                  alt={alt}
                  width={width}
                  height={height}
                  layout="responsive"
                  objectFit="scale-down"
                />
              );
            },
          }}
        />
      ) : null}
      <ArticleFooter
        sx={{
          mt: 4,
        }}
        article={article}
      />
    </article>
    <Newsletter
      sx={{
        mt: 3,
      }}
    />
    {related.length !== 0 ? (
      <ArticleRelatedList
        sx={{
          mt: 3,
        }}
        articles={related}
      />
    ) : null}
  </Page>
);

export default ArticlePage;
