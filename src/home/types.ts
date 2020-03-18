import { ArticleData } from '../article/types';
import { PageData } from '../core/types';

export interface HomePageData extends PageData {
  pageNumber: number;
  articles: ArticleData[];
}
