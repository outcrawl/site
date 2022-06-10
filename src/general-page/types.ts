import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';

export type GeneralPageData = {
  slug: string;
  url: string;
  title: string;
  description: string;
  assetPath: string;
  content?: MDXRemoteSerializeResult;
};
