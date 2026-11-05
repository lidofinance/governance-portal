import React from 'react';
import type { Components } from 'react-markdown';
import { REGEX_CID_CUTER, REGEX_CID_ONLY } from './regex-cid';
import { getIpfsUrl } from './get-ipfs-url';
import { REGEX_ETH_ADDRESS_ONLY } from './regex-eth-address';
import { AddressBadge } from '../shared/wallet/address-badge/address-badge';
import { REGEX_URL_ONLY } from './regex-url';
import { ExternalLink } from '../shared/components/external-link/external-link';
import { OffChainTag } from '../shared/components/off-chain-tag';

type CodeType = Components['code'];
export const replaceAddressAndCIDInMD: CodeType = ({
  inline,
  children,
  ...props
}) => {
  const value = Array.isArray(children) ? `${children[0]}` : `${children}`;

  if (inline && value.match(REGEX_CID_ONLY)) {
    return (
      <ExternalLink href={getIpfsUrl(value)} asLink>
        {value.replace(REGEX_CID_CUTER, '$1..$2')}
      </ExternalLink>
    );
  }

  if (inline && value.match(REGEX_ETH_ADDRESS_ONLY)) {
    return <AddressBadge address={value} />;
  }

  if (inline && value.toLowerCase() === 'off-chain') {
    return <OffChainTag />;
  }

  return <code {...props}>{children}</code>;
};
type LinkType = Components['a'];

const createLinkRenderer =
  (asLink: boolean): LinkType =>
  ({ children, href }) => {
    if (href?.match(REGEX_URL_ONLY)) {
      return (
        <ExternalLink href={href} asLink={asLink}>
          {children}
        </ExternalLink>
      );
    }
    // not supporting internal links
    return (
      <span>
        {children}
        {href ? ` (${href})` : ''}
      </span>
    );
  };

export const replaceLinksInMD = createLinkRenderer(false);
export const replaceLinksInMDAsAnchor = createLinkRenderer(true);

type ImgType = Components['img'];

export const replaceImagesInMD: ImgType = ({ children, title, alt, src }) => {
  if (src?.match(REGEX_URL_ONLY)) {
    return (
      <ExternalLink href={src} asLink>
        {title || alt || 'view'} image
      </ExternalLink>
    );
  }
  // not supporting internal links
  return (
    <span>
      {title || alt || children}
      {src ? ` (${src})` : ''}
    </span>
  );
};
