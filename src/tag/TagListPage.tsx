import InternalLink from '../common/InternalLink';
import Page from '../common/Page';
import { loadConfig } from '../config';
import GeneralPageMeta from '../general-page/GeneralPageMeta';
import { routerRedirects } from '../routes';
import { TagGroupData } from './types';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

type TagListPageProps = {
  tags: TagGroupData[];
};

const TagListPage: React.FC<TagListPageProps> = ({
  tags,
}: TagListPageProps) => {
  const config = loadConfig();

  return (
    <Page narrow>
      <GeneralPageMeta
        title={`Tags - ${config.title}`}
        description={`Tags on ${config.title}.`}
        url={`${config.url}${routerRedirects.tags.index}`}
      />
      <Typography variant="h1" gutterBottom>
        Tags
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        {tags.map((tag) => (
          <InternalLink
            sx={{
              verticalAlign: 'middle',
              display: 'inline-block',
              lineHeight: 1,
              mx: 1,
              my: 2,
            }}
            key={tag.slug}
            href={routerRedirects.tags.tag(tag.slug).index}
            style={{
              fontSize:
                Math.max((tag.articleCount * 15) / tags.length, 1).toString() +
                'rem',
            }}
          >
            {tag.title}
          </InternalLink>
        ))}
      </Box>
    </Page>
  );
};

export default TagListPage;
