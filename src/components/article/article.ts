import { Author } from '../author';

interface ArticleTag {
  slug: string;
  title: string;
}

export default interface Article {
  title: string;
  slug: string;
  url: string;
  description?: string;
  date?: Date;
  cover?: any;
  html?: string;
  author?: Author;
  tags: ArticleTag[];
  related: Article[];
}
