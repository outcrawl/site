export interface Tag {
  title: string;
  slug: string;
}

export interface TagInfo {
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
