import ArticleCardGrid from '../article/ArticleCardGrid';
import { ArticleData } from '../article/types';
import InternalLink from '../common/InternalLink';
import Page from '../common/Page';
import { loadConfig } from '../config';
import GeneralPageMeta from '../general-page/GeneralPageMeta';
import { routerRedirects } from '../routes';
import { Pagination, PaginationItem } from '@mui/material';
import React, { ReactNode } from 'react';

type HomePageProps = {
  articles: ArticleData[];
  page: number;
  pageCount: number;
};

const HomePage: React.FC<HomePageProps> = ({
  articles,
  page,
  pageCount,
}: HomePageProps) => {
  const config = loadConfig();

  return (
    <Page>
      <GeneralPageMeta
        title={`${config.title} - ${config.description}`}
        description={config.description}
        url={`${config.url}${routerRedirects.home.page(page)}`}
      />
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
            href={routerRedirects.home.page(item.page || 1)}
            underline="none"
            {...item}
          />
        )}
      />
    </Page>
  );
};

export default HomePage;
