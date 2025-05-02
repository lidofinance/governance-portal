import React from 'react';
import { ExternalLinkIconFooter, FooterLink } from './styles';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const ExternalLink = ({ children, ...props }) => (
  <FooterLink target="_blank" rel="noopener noreferrer" {...props}>
    {children}
    <ExternalLinkIconFooter />
  </FooterLink>
);
