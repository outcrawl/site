import { PageData } from '../core/types';

export interface TagData {
  title: string;
  slug: string;
}

export interface TagGroup {
  tag: TagData;
  size: number;
}

export interface TagPageData extends PageData {
  pageNumber: number;
  pageCount: number;
  tag: TagData;
}
