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

export interface ArticleInfo {
  site: {
    title: string;
    description: string;
    twitterId: string;
    facebookId: string;
    url: string;
  };
  image: {
    url: string;
    width: number;
    height: number;
  };
}
