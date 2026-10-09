import Hash from 'ipfs-only-hash';
import { getIpfsUrls } from './get-ipfs-url';

// Range hint for callers without a size limit: 100kb
const DEFAULT_MAX_BYTES = 100_000;

const IPFS_FETCH_TIMEOUT = 8000;

type FetcherIpfs = (
  cid: string,
  maxBytes?: number,
  timeoutMs?: number,
) => Promise<string>;

// The range header is advisory; gateways may ignore it, so stop reading past the limit.
const readTextWithLimit = async (response: Response, maxBytes: number) => {
  if (!response.body) {
    return '';
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let bytesRead = 0;
  let chunk = await reader.read();
  while (!chunk.done) {
    bytesRead += chunk.value.byteLength;
    if (bytesRead > maxBytes) {
      await reader.cancel();
      throw new Error('IPFS content exceeds the size limit.');
    }
    text += decoder.decode(chunk.value, { stream: true });
    chunk = await reader.read();
  }
  return text + decoder.decode();
};

const fetchAndValidate = async (
  cid: string,
  url: string,
  maxBytes: number | undefined,
  timeoutMs: number,
): Promise<string> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'text/plain',
      range: `bytes=0-${maxBytes ?? DEFAULT_MAX_BYTES}`,
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }

  const text =
    maxBytes === undefined
      ? await response.text()
      : await readTextWithLimit(response, maxBytes);

  const [hash, hashBOM] = await Promise.all([
    Hash.of(text, { cidVersion: 1, rawLeaves: true }),
    Hash.of('\uFEFF' + text, { cidVersion: 1, rawLeaves: true }),
  ]);

  if (![hash, hashBOM].includes(cid)) {
    throw new Error('An error occurred while validate fetched the data.');
  }

  return text;
};

export const fetcherIPFS: FetcherIpfs = async (
  cid,
  maxBytes,
  timeoutMs = IPFS_FETCH_TIMEOUT,
) => {
  let lastError: unknown;
  for (const url of getIpfsUrls(cid)) {
    try {
      return await fetchAndValidate(cid, url, maxBytes, timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};
