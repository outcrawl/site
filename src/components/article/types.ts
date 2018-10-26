import { Author } from '../author';
import { Tag } from '../tag';

export interface Article {
  title: string;
  slug: string;
  url: string;
  description?: string;
  date?: Date;
  cover?: any;
  html?: string;
  author?: Author;
  tags: Tag[];
  related: Article[];
}
