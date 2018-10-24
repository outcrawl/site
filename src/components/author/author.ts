export default interface Author {
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
