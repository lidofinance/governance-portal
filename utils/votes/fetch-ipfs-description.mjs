import Hash from 'ipfs-only-hash';

const CID_1_32 = '[bB][A-Za-z2-7]{58,128}';
const REGEX_LIDO_VOTE_CID = new RegExp(`\\blidovoteipfs://(${CID_1_32})\\s*$`);

const IPFS_TIMEOUT_MS = 8000;
const MAX_BYTES = 32_000;

// Keep in sync with utils/get-ipfs-url.ts.
const getIpfsUrls = (cid) => [
  `https://ipfs.filebase.io/ipfs/${cid}`,
  `https://gateway.pinata.cloud/ipfs/${cid}`,
];

// The range header is advisory; gateways may ignore it, so stop reading past the limit.
const readTextWithLimit = async (response) => {
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
    if (bytesRead > MAX_BYTES) {
      await reader.cancel();
      throw new Error('IPFS content exceeds the size limit.');
    }
    text += decoder.decode(chunk.value, { stream: true });
    chunk = await reader.read();
  }
  return text + decoder.decode();
};

const fetchCid = async (cid, url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'text/plain',
      range: `bytes=0-${MAX_BYTES}`,
    },
    signal: AbortSignal.timeout(IPFS_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`IPFS gateway returned ${response.status}`);
  }

  const text = await readTextWithLimit(response);

  const [hash, hashBOM] = await Promise.all([
    Hash.of(text, { cidVersion: 1, rawLeaves: true }),
    Hash.of('\uFEFF' + text, { cidVersion: 1, rawLeaves: true }),
  ]);

  if (hash !== cid && hashBOM !== cid) {
    throw new Error('IPFS hash validation failed');
  }

  return text;
};

/**
 * Resolves the IPFS description referenced by a StartVote `metadata` string.
 * Returns the raw text on success, or `null` when metadata has no CID or the
 * fetch fails. The build script writes the result alongside the raw
 * `metadata`, so the runtime can still fall back to the on-chain string when
 * this returns `null`.
 */
export const fetchIpfsDescription = async (metadata) => {
  if (typeof metadata !== 'string' || metadata.length === 0) {
    return null;
  }

  const match = metadata.match(REGEX_LIDO_VOTE_CID);
  const cid = match?.[1];
  if (!cid) {
    return null;
  }

  let lastError;
  for (const url of getIpfsUrls(cid)) {
    try {
      return await fetchCid(cid, url);
    } catch (error) {
      lastError = error;
    }
  }
  console.warn(
    `    [IPFS] Failed to fetch description for CID ${cid}: ${lastError.message}`,
  );
  return null;
};
