import { AuthorData } from '../author/types';
import { TagData } from '../tag/types';
import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types';

export type ArticleData = {
  slug: string;
  kind: ArticleKind;
  url: string;
  title: string;
  date: string;
  description: string;
  tags: TagData[];
  assetPath: string;
  cover?: ArticleCoverData;
  author?: AuthorData;
  content?: MDXRemoteSerializeResult;
  containsMath?: boolean;
};

export enum ArticleKind {
  STANDARD = 'STANDARD',
  SHORT = 'SHORT',
}

export type ArticleCoverData = {
  path: string;
  width: number;
  height: number;
};
