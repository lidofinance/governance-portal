const dwebPrefix = 'https://';
const dwebSuffix = '.ipfs.dweb.link';

const pinataPrefix = 'https://gateway.pinata.cloud/ipfs/';

const defaultPrefix = 'https://cloudflare-ipfs.com/ipfs/';
const defaultSuffix = '';

export const getIpfsUrls = (cid: string): string[] =>
  `${cid}`.match(/^b/i)
    ? [`${dwebPrefix}${cid}${dwebSuffix}`, `${pinataPrefix}${cid}`]
    : [`${defaultPrefix}${cid}${defaultSuffix}`, `${pinataPrefix}${cid}`];

export const getIpfsUrl = (cid: string) => getIpfsUrls(cid)[0];
