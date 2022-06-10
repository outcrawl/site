export type AuthorData = {
  name: string;
  url: string;
  slug: string;
  bio: string;
  avatar: string;
  email?: string;
  hire?: boolean;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
};
