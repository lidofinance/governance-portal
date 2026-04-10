import Hash from 'ipfs-only-hash';

const CID_1_32 = '[bB][A-Za-z2-7]{58,128}';
const REGEX_LIDO_VOTE_CID = new RegExp(`\\blidovoteipfs://(${CID_1_32})\\s*$`);

const IPFS_TIMEOUT_MS = 8000;
const MAX_BYTES = 100_000;

const getIpfsUrl = (cid) =>
  /^b/i.test(cid)
    ? `https://${cid}.ipfs.w3s.link`
    : `https://cloudflare-ipfs.com/ipfs/${cid}`;

const fetchCid = async (cid) => {
  const response = await fetch(getIpfsUrl(cid), {
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

  const text = await response.text();

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

  try {
    return await fetchCid(cid);
  } catch (firstError) {
    try {
      return await fetchCid(cid);
    } catch (secondError) {
      console.warn(
        `    [IPFS] Failed to fetch description for CID ${cid}: ${secondError.message}`,
      );
      return null;
    }
  }
};
