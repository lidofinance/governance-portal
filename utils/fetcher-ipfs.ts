import Hash from 'ipfs-only-hash';
import { getIpfsUrl } from './get-ipfs-url';

export const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'text/plain',
    // 100kb max description filesize (about 50k words)
    range: 'bytes=0-100000',
  },
};

const IPFS_FETCH_TIMEOUT = 8000;

type FetcherIpfs = (
  cid: string,
  params?: RequestInit,
  timeoutMs?: number,
) => Promise<string>;
export const fetcherIPFS: FetcherIpfs = async (
  cid,
  params = DEFAULT_PARAMS,
  timeoutMs = IPFS_FETCH_TIMEOUT,
) => {
  const paramsWithTimeout = {
    ...params,
    signal: AbortSignal.timeout(timeoutMs),
  };
  const response = await fetch(getIpfsUrl(cid), paramsWithTimeout);

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }

  const text = await response.text();

  const [hash, hashBOM] = await Promise.all([
    Hash.of(text, { cidVersion: 1, rawLeaves: true }),
    Hash.of('\uFEFF' + text, { cidVersion: 1, rawLeaves: true }),
  ]);

  if (![hash, hashBOM].includes(cid)) {
    throw new Error('An error occurred while validate fetched the data.');
  }

  return text;
};
