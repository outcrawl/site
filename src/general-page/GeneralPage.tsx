import Page from '../common/Page';
import { loadConfig } from '../config';
import MdxContent from '../mdx/MdxContent';
import GeneralPageMeta from './GeneralPageMeta';
import { GeneralPageData } from './types';
import { Typography } from '@mui/material';
import ExportedImage from 'next-image-export-optimizer';
import React from 'react';

type GeneralPageProps = { page: GeneralPageData };

const GeneralPage: React.FC<GeneralPageProps> = ({
  page,
}: GeneralPageProps) => {
  const config = loadConfig();

  return (
    <Page narrow>
      <GeneralPageMeta
        title={`${page.title} - ${config.title}`}
        description={page.description}
        url={page.url}
      />
      <article>
        <Typography variant="h1" gutterBottom>
          {page.title}
        </Typography>
        {page.content !== undefined ? (
          <MdxContent
            source={page.content}
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
                    src={`${page.assetPath}/${src}`}
                    alt={alt}
                    width={width}
                    height={height}
                    layout="responsive"
                    objectFit="scale-down"
                    placeholder="blur"
                    blurDataURL={`${page.assetPath}/nextImageExportOptimizer/cover-opt-10.WEBP`}
                  />
                );
              },
            }}
          />
        ) : null}
      </article>
    </Page>
  );
};

export default GeneralPage;
