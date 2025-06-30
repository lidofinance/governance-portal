import React from 'react';
import type { Components } from 'react-markdown';
import Link from 'next/link';
import { REGEX_CID_CUTER, REGEX_CID_ONLY } from './regex-cid';
import { getIpfsUrl } from './get-ipfs-url';
import { REGEX_ETH_ADDRESS_ONLY } from './regex-eth-address';
import { AddressBadge } from '../shared/wallet/address-badge/address-badge';
import { REGEX_URL_ONLY } from './regex-url';
import { ExternalLink } from '../shared/components/external-link/external-link';

type CodeType = Components['code'];
export const replaceAddressAndCIDInMD: CodeType = ({
  inline,
  children,
  ...props
}) => {
  const value = Array.isArray(children) ? `${children[0]}` : `${children}`;

  if (inline && value.match(REGEX_CID_ONLY)) {
    return (
      <Link href={getIpfsUrl(value)}>
        {value.replace(REGEX_CID_CUTER, '$1..$2')}
      </Link>
    );
  }

  if (inline && value.match(REGEX_ETH_ADDRESS_ONLY)) {
    return <AddressBadge address={value} />;
  }

  return <code {...props}>{children}</code>;
};
type LinkType = Components['a'];

export const replaceLinksInMD: LinkType = ({ children, href }) => {
  if (href?.match(REGEX_URL_ONLY)) {
    return <ExternalLink href={href}>{children}</ExternalLink>;
  }
  // not supporting internal links
  return (
    <span>
      {children}
      {href ? ` (${href})` : ''}
    </span>
  );
};

type ImgType = Components['img'];

export const replaceImagesInMD: ImgType = ({ children, title, alt, src }) => {
  if (src?.match(REGEX_URL_ONLY)) {
    return <Link href={src}>{title || alt || 'view'} image</Link>;
  }
  // not supporting internal links
  return (
    <span>
      {title || alt || children}
      {src ? ` (${src})` : ''}
    </span>
  );
};
