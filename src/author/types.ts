export interface AuthorData {
  name: string;
  slug: string;
  bio: string;
  email: string;
  avatar: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}
