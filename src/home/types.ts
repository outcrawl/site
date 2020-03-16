import { ArticleData } from '../article/types';
import { PageData } from '../core/types';

export interface HomePageData extends PageData {
  page: number;
  articles: ArticleData[];
}
