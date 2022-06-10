export type TagData = {
  slug: string;
  title: string;
  url: string;
};

export type TagGroupData = TagData & {
  articleCount: number;
};
