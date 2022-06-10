import ArticleCardGrid from '../article/ArticleCardGrid';
import { ArticleData } from '../article/types';
import InternalLink from '../common/InternalLink';
import Page from '../common/Page';
import { loadConfig } from '../config';
import GeneralPageMeta from '../general-page/GeneralPageMeta';
import { routerRedirects } from '../routes';
import { TagData } from './types';
import { Pagination, PaginationItem, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type TagPageProps = {
  tag: TagData;
  articles: ArticleData[];
  page: number;
  pageCount: number;
};

const TagPage: React.FC<TagPageProps> = ({
  tag,
  articles,
  page,
  pageCount,
}: TagPageProps) => {
  const config = loadConfig();

  return (
    <Page>
      <GeneralPageMeta
        title={`${tag.title} - ${config.title}`}
        description={`${tag.title} tag on ${config.title}.`}
        url={`${config.url}${routerRedirects.tags.tag(tag.slug).page(page)}`}
      />
      <Typography variant="h1">{tag.title}</Typography>
      <ArticleCardGrid articles={articles} />
      <Pagination
        sx={{
          display: 'flex',
          justifyContent: 'center',
          my: 2,
        }}
        color="primary"
        size="large"
        page={page}
        count={pageCount}
        renderItem={(item): ReactNode => (
          <PaginationItem
            component={InternalLink}
            href={routerRedirects.tags.tag(tag.slug).page(item.page || 1)}
            underline="none"
            {...item}
          />
        )}
      />
    </Page>
  );
};

export default TagPage;
