import type { Address } from 'viem';
import type {
  ArchivedVote,
  VoteEventsManifest,
  VoteEventsSubset,
} from 'shared/votes/cache/types';

const manifestUrl = (chainId: number, votingAddress: Address) =>
  `/votes-events/${chainId}/${votingAddress}/manifest.json`;
const chunkUrl = (chainId: number, votingAddress: Address, file: string) =>
  `/votes-events/${chainId}/${votingAddress}/${file}`;

const manifestPromises = new Map<string, Promise<VoteEventsManifest | null>>();
const chunkPromises = new Map<string, Promise<VoteEventsSubset>>();

const isValidManifest = (raw: unknown): raw is VoteEventsManifest => {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const manifest = raw as Partial<VoteEventsManifest>;
  return (
    typeof manifest.chunkSize === 'number' &&
    typeof manifest.firstId === 'number' &&
    typeof manifest.lastId === 'number' &&
    manifest.chunks !== null &&
    typeof manifest.chunks === 'object'
  );
};

const isValidChunk = (raw: unknown): raw is Record<string, unknown> =>
  raw !== null && typeof raw === 'object' && !Array.isArray(raw);

const isValidArchivedVote = (raw: unknown): raw is ArchivedVote => {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const entry = raw as Partial<ArchivedVote>;
  return (
    entry.voteDetails !== null &&
    typeof entry.voteDetails === 'object' &&
    Array.isArray(entry.voteEvents)
  );
};

const fetchManifest = (
  chainId: number,
  votingAddress: Address,
): Promise<VoteEventsManifest | null> => {
  const key = `${chainId}:${votingAddress}`;
  const cached = manifestPromises.get(key);
  if (cached) {
    return cached;
  }
  const promise = fetch(manifestUrl(chainId, votingAddress))
    .then(async (response) => {
      if (!response.ok) {
        return null;
      }
      const raw = (await response.json()) as unknown;
      return isValidManifest(raw) ? raw : null;
    })
    .catch(() => null);
  manifestPromises.set(key, promise);
  return promise;
};

const fetchChunk = (
  chainId: number,
  votingAddress: Address,
  file: string,
): Promise<VoteEventsSubset> => {
  const key = `${chainId}:${votingAddress}:${file}`;
  const cached = chunkPromises.get(key);
  if (cached) {
    return cached;
  }
  const promise = fetch(chunkUrl(chainId, votingAddress, file))
    .then(async (response) => {
      if (!response.ok) {
        return {} as VoteEventsSubset;
      }
      const raw = (await response.json()) as unknown;
      if (!isValidChunk(raw)) {
        return {} as VoteEventsSubset;
      }
      const filtered: VoteEventsSubset = {};
      for (const [voteId, entry] of Object.entries(raw)) {
        if (isValidArchivedVote(entry)) {
          filtered[voteId] = entry;
        }
      }
      return filtered;
    })
    .catch(() => ({}) as VoteEventsSubset);
  chunkPromises.set(key, promise);
  return promise;
};

export const fetchCachedVoteEvents = async (
  chainId: number,
  votingAddress: Address,
  voteIds: (string | number)[],
): Promise<VoteEventsSubset> => {
  if (voteIds.length === 0) {
    return {};
  }

  const manifest = await fetchManifest(chainId, votingAddress);
  if (!manifest) {
    return {};
  }

  const { chunkSize, firstId, lastId, chunks } = manifest;

  const chunkIndices = new Set<number>();
  for (const id of voteIds) {
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
    chunkFiles.map((file) => fetchChunk(chainId, votingAddress, file)),
  );

  const requested = new Set(voteIds.map(String));
  const merged: VoteEventsSubset = {};
  for (const result of results) {
    for (const [id, entry] of Object.entries(result)) {
      if (requested.has(id)) {
        merged[id] = entry;
      }
    }
  }
  return merged;
};
