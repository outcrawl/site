import { AuthorData } from '../author/types';
import { TagData } from '../tag/types';

export interface ArticleData {
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
  article: ArticleData;
  description?: string;
  html: string;
  tags: TagData[];
  related: ArticleData[];
}
