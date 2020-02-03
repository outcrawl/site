import { AuthorData } from '../author/types';
import { TagData } from '../tag/types';

export interface ArticleData {
  title: string;
  slug: string;
  url: string;
  description?: string;
  date?: Date;
  cover?: any;
  html?: string;
  author?: AuthorData;
  tags: TagData[];
  related: ArticleData[];
}
