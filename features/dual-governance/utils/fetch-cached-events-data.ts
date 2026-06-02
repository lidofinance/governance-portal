import {
  ProposalEventsManifest,
  ProposalEventsSubset,
} from '../proposals/types';

const getManifestUrl = (chainId: number) =>
  `/proposals-events/${chainId}/manifest.json`;
const getChunkUrl = (chainId: number, file: string) =>
  `/proposals-events/${chainId}/${file}`;

const manifestPromises = new Map<
  number,
  Promise<ProposalEventsManifest | null>
>();
const chunkPromises = new Map<string, Promise<ProposalEventsSubset>>();

const isValidManifest = (raw: unknown): raw is ProposalEventsManifest => {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const manifest = raw as Partial<ProposalEventsManifest>;
  return (
    typeof manifest.chunkSize === 'number' &&
    typeof manifest.firstId === 'number' &&
    typeof manifest.lastId === 'number' &&
    manifest.chunks !== null &&
    typeof manifest.chunks === 'object'
  );
};

const fetchManifest = (
  chainId: number,
): Promise<ProposalEventsManifest | null> => {
  const cached = manifestPromises.get(chainId);
  if (cached) {
    return cached;
  }
  const promise = fetch(getManifestUrl(chainId))
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }
      const raw = (await response.json()) as unknown;
      return isValidManifest(raw) ? raw : null;
    })
    .catch(() => null);
  manifestPromises.set(chainId, promise);
  return promise;
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
  const promise = fetch(getChunkUrl(chainId, file))
    .then(async (response) => {
      if (!response.ok) {
        return {} as ProposalEventsSubset;
      }
      return (await response.json()) as ProposalEventsSubset;
    })
    .catch(() => ({}) as ProposalEventsSubset);
  chunkPromises.set(key, promise);
  return promise;
};

export const fetchCachedProposalEvents = async (
  chainId: number,
  proposalIds: (string | number)[],
  useLocalCache: boolean,
): Promise<ProposalEventsSubset> => {
  if (!useLocalCache || proposalIds.length === 0) {
    return {};
  }

  const manifest = await fetchManifest(chainId);
  if (!manifest) {
    return {};
  }

  const { chunkSize, firstId, lastId, chunks } = manifest;

  const chunkIndices = new Set<number>();
  for (const id of proposalIds) {
    const numericId = Number(id);
    if (
      !Number.isFinite(numericId) ||
      numericId < firstId ||
      numericId > lastId
    ) {
      continue;
    }
    chunkIndices.add(Math.floor((numericId - firstId) / chunkSize));
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
