import { AuthorData } from '../author/types';
import { TagData } from '../tag/types';
import { MetaData } from '../common/types';

export interface ArticleInfo {
  title: string;
  slug: string;
  url: string;
  cover?: ArticleCover;
  author?: AuthorData;
  date?: string;
}

export interface ArticleCover {
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes: string;
}

export interface ArticlePageData {
  info: ArticleInfo;
  meta: MetaData;
  description?: string;
  html: string;
  tags: TagData[];
  related: ArticleInfo[];
}
