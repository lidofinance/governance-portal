const filebasePrefix = 'https://ipfs.filebase.io/ipfs/';
const pinataPrefix = 'https://gateway.pinata.cloud/ipfs/';

export const getIpfsUrls = (cid: string): string[] => [
  `${filebasePrefix}${cid}`,
  `${pinataPrefix}${cid}`,
];

export const getIpfsUrl = (cid: string) => getIpfsUrls(cid)[0];
