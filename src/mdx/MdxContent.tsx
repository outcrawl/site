import ExternalLink from '../common/ExternalLink';
import InternalLink from '../common/InternalLink';
import MdxBlockCode from './MdxBlockCode';
import MdxContentHeading from './MdxContentHeading';
import MdxContentNote from './MdxContentNote';
import MdxInlineCode from './MdxInlineCode';
import { MDXSource } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote';
import React, { AnchorHTMLAttributes, HTMLAttributes } from 'react';

type MdxContentProps = {
  source: MDXSource;
  components: MDXRemoteProps['components'];
};

const MdxContent: React.FC<MdxContentProps> = ({
  source,
  components,
}: MdxContentProps) => (
  <MDXRemote
    {...source}
    lazy
    components={{
      p: ({ children }: HTMLAttributes<HTMLElement>) => (
        <Typography sx={{ marginBottom: '1rem' }} variant="body1">
          {children}
        </Typography>
      ),
      h1: (props: HTMLAttributes<HTMLElement>) => (
        <MdxContentHeading variant="h2" {...props} />
      ),
      h2: (props: HTMLAttributes<HTMLElement>) => (
        <MdxContentHeading variant="h3" {...props} />
      ),
      h3: (props: HTMLAttributes<HTMLElement>) => (
        <MdxContentHeading variant="h4" {...props} />
      ),
      h4: (props: HTMLAttributes<HTMLElement>) => (
        <MdxContentHeading variant="h5" {...props} />
      ),
      h5: (props: HTMLAttributes<HTMLElement>) => (
        <MdxContentHeading variant="h6" {...props} />
      ),
      a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) =>
        props.href === undefined ? (
          <a {...props} />
        ) : props.href.startsWith('http') ? (
          <ExternalLink {...props} />
        ) : (
          <InternalLink {...props} />
        ),
      code: MdxInlineCode,
      pre: MdxBlockCode,
      table: ({ children }) => (
        <TableContainer sx={{ mb: 1 }}>
          <Table>{children}</Table>
        </TableContainer>
      ),
      thead: ({ children }) => <TableHead>{children}</TableHead>,
      tr: ({ children }) => <TableRow>{children}</TableRow>,
      tbody: ({ children }) => <TableBody>{children}</TableBody>,
      th: ({ children }) => <TableCell variant="head">{children}</TableCell>,
      td: ({ children }) => <TableCell variant="body">{children}</TableCell>,
      MdxContentNote: (props) => (
        <MdxContentNote sx={{ mb: 1, '& p': { mb: 0 } }} {...props} />
      ),
      ...components,
    }}
  />
);

export default MdxContent;
