import React from 'react';
import { Box } from '@material-ui/core';

type PageSectionProps = {
  children: React.ReactNode;
  component?: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
}

const PageSection: React.FC<PageSectionProps> = (props: PageSectionProps) => (
  <Box component={props.component}>
    {props.children}
  </Box>
);

export default PageSection;
