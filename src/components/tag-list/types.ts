export interface TagGroup {
  size: number;
  slug: string;
  title: string;
}

export interface TagListInfo {
  site: {
    title: string;
    description: string;
    twitterId: string;
    facebookId: string;
  };
  url: string;
  title: string;
  description: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
}
