import AuthorAvatar from '../author/AuthorAvatar';
import InternalLink from '../common/InternalLink';
import { routerRedirects } from '../routes';
import { ArticleData } from './types';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import ExportedImage from 'next-image-export-optimizer';
import React from 'react';

type ArticleCardProps = {
  sx?: SxProps<Theme>;
  article: ArticleData;
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  sx,
  article,
}: ArticleCardProps) => (
  <Card sx={sx}>
    {article.cover !== undefined ? (
      <InternalLink href={routerRedirects.article(article.slug)}>
        <ExportedImage
          src={article.cover.path}
          width={article.cover.width}
          height={article.cover.height}
          alt={article.title}
          layout="responsive"
          placeholder="blur"
          blurDataURL={`${article.assetPath}/nextImageExportOptimizer/cover-opt-10.WEBP`}
        />
      </InternalLink>
    ) : null}
    <CardContent>
      <Typography variant="h5">
        <InternalLink
          color="inherit"
          href={routerRedirects.article(article.slug)}
        >
          {article.title}
        </InternalLink>
      </Typography>
    </CardContent>
    <CardActions sx={{ pt: 0 }}>
      {article.author !== undefined ? (
        <AuthorAvatar
          author={article.author}
          subtext={article.date}
          disableHire
        />
      ) : null}
    </CardActions>
  </Card>
);

export default ArticleCard;
