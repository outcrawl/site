import { Author } from '../author';

export interface Article {
  title: string;
  slug: string;
  description: string;
  date: Date;
  cover: string;
  html?: string;
  author?: Author;
}
