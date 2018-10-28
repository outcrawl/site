export interface Author {
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatar: string;
  social: {
    github?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface AuthorInfo {
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
