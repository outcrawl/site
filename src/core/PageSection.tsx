import React from 'react';
import { Container } from '@material-ui/core';

type PageSectionProps = {
  children: React.ReactNode;
  component?: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
}

const PageSection: React.FC<PageSectionProps> = (props: PageSectionProps) => (
  <Container component={props.component}>
    {props.children}
  </Container>
);

export default PageSection;
