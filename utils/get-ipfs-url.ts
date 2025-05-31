const w3sPrefix = 'https://';
const w3sSuffix = '.ipfs.w3s.link';

const defaultPrefix = 'https://cloudflare-ipfs.com/ipfs/';
const defaultSuffix = '';

export const getIpfsUrl = (cid: string) =>
  `${cid}`.match(/^b/i)
    ? `${w3sPrefix}${cid}${w3sSuffix}`
    : `${defaultPrefix}${cid}${defaultSuffix}`;
