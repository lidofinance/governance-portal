import type { Address } from 'viem';
import type {
  VoteDescriptionEntry,
  VoteDescriptionsMap,
} from 'shared/votes/cache/types';

const descriptionsUrl = (chainId: number, votingAddress: Address) =>
  `/votes-events/${chainId}/${votingAddress}/descriptions.json`;

const descriptionsPromises = new Map<string, Promise<VoteDescriptionsMap>>();

const isValidEntry = (raw: unknown): raw is VoteDescriptionEntry => {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const entry = raw as Partial<VoteDescriptionEntry>;
  return typeof entry.metadata === 'string';
};

export const fetchVotesDescriptions = (
  chainId: number,
  votingAddress: Address,
): Promise<VoteDescriptionsMap> => {
  const key = `${chainId}:${votingAddress}`;
  const cached = descriptionsPromises.get(key);
  if (cached) {
    return cached;
  }
  const promise = fetch(descriptionsUrl(chainId, votingAddress))
    .then(async (response) => {
      if (!response.ok) {
        return {} as VoteDescriptionsMap;
      }
      const raw = (await response.json()) as unknown;
      if (raw === null || typeof raw !== 'object') {
        return {} as VoteDescriptionsMap;
      }
      const result: VoteDescriptionsMap = {};
      for (const [voteId, entry] of Object.entries(raw)) {
        if (isValidEntry(entry)) {
          result[voteId] = entry;
        }
      }
      return result;
    })
    .catch(() => ({}) as VoteDescriptionsMap);
  descriptionsPromises.set(key, promise);
  return promise;
};
