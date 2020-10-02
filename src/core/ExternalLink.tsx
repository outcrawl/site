import React from 'react';

type ExternalLinkProps = {
  href: string;
} & React.HTMLAttributes<HTMLAnchorElement>;

const ExternalLink: React.FC<ExternalLinkProps> = (props: ExternalLinkProps) => <a
  rel="noopener noreferrer" {...props} />;

export default ExternalLink;
