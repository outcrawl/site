import { Author } from '../author';

export default interface Article {
  title: string;
  slug: string;
  description: string;
  date: Date;
  cover?: any;
  html?: string;
  author?: Author;
}
