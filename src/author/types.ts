export interface AuthorData {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface AuthorArticleData {
  title: string;
  slug: string;
  url: string;
  date?: string;
}
