import {
  ProposalEventsManifest,
  ProposalEventsSubset,
} from '../proposals/types';

const manifestUrl = (chainId: number) =>
  `/proposals-events/${chainId}/manifest.json`;
const chunkUrl = (chainId: number, file: string) =>
  `/proposals-events/${chainId}/${file}`;

const manifestPromises = new Map<
  number,
  Promise<ProposalEventsManifest | null>
>();
const chunkPromises = new Map<string, Promise<ProposalEventsSubset>>();

const isValidManifest = (raw: unknown): raw is ProposalEventsManifest => {
  if (raw === null || typeof raw !== 'object') return false;
  const m = raw as Partial<ProposalEventsManifest>;
  return (
    typeof m.chunkSize === 'number' &&
    typeof m.firstId === 'number' &&
    typeof m.lastId === 'number' &&
    m.chunks !== null &&
    typeof m.chunks === 'object'
  );
};

const fetchManifest = (
  chainId: number,
): Promise<ProposalEventsManifest | null> => {
  const cached = manifestPromises.get(chainId);
  if (cached) {
    return cached;
  }
  const p = fetch(manifestUrl(chainId))
    .then(async (r) => {
      if (!r.ok) {
        return null;
      }
      const raw = (await r.json()) as unknown;
      return isValidManifest(raw) ? raw : null;
    })
    .catch(() => null);
  manifestPromises.set(chainId, p);
  return p;
};

const fetchChunk = (
  chainId: number,
  file: string,
): Promise<ProposalEventsSubset> => {
  const key = `${chainId}:${file}`;
  const cached = chunkPromises.get(key);
  if (cached) {
    return cached;
  }
  const p = fetch(chunkUrl(chainId, file))
    .then(async (r) => {
      if (!r.ok) {
        return {} as ProposalEventsSubset;
      }
      return (await r.json()) as ProposalEventsSubset;
    })
    .catch(() => ({}) as ProposalEventsSubset);
  chunkPromises.set(key, p);
  return p;
};

export const fetchCachedProposalEvents = async (
  chainId: number,
  proposalIds: (string | number)[],
): Promise<ProposalEventsSubset> => {
  if (proposalIds.length === 0) {
    return {};
  }

  const manifest = await fetchManifest(chainId);
  if (!manifest) {
    return {};
  }

  const { chunkSize, firstId, lastId, chunks } = manifest;

  const chunkIndices = new Set<number>();
  for (const id of proposalIds) {
    const n = Number(id);
    if (!Number.isFinite(n) || n < firstId || n > lastId) {
      continue;
    }
    chunkIndices.add(Math.floor((n - firstId) / chunkSize));
  }

  const chunkFiles: string[] = [];
  for (const idx of chunkIndices) {
    const file = chunks[String(idx)];
    if (file) {
      chunkFiles.push(file);
    }
  }

  if (chunkFiles.length === 0) {
    return {};
  }

  const results = await Promise.all(
    chunkFiles.map((file) => fetchChunk(chainId, file)),
  );

  const requested = new Set(proposalIds.map(String));
  const merged: ProposalEventsSubset = {};
  for (const result of results) {
    for (const [id, entry] of Object.entries(result)) {
      if (requested.has(id)) {
        merged[id] = entry;
      }
    }
  }
  return merged;
};
