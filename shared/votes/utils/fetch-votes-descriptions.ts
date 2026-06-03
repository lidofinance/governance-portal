import type { Address } from 'viem';
import type {
  VoteDescriptionEntry,
  VoteDescriptionsMap,
} from 'shared/votes/cache/types';

const descriptionsUrl = (chainId: number, votingAddress: Address) =>
  `/votes-events/${chainId}/${votingAddress}/descriptions.json`;

const isValidEntry = (raw: unknown): raw is VoteDescriptionEntry => {
  if (raw === null || typeof raw !== 'object') {
    return false;
  }
  const entry = raw as Partial<VoteDescriptionEntry>;
  return typeof entry.metadata === 'string';
};

export const fetchVotesDescriptions = async (
  chainId: number,
  votingAddress: Address,
): Promise<VoteDescriptionsMap> => {
  const response = await fetch(descriptionsUrl(chainId, votingAddress));
  if (!response.ok) {
    return {};
  }
  const raw = (await response.json()) as unknown;
  if (raw === null || typeof raw !== 'object') {
    return {};
  }
  const descriptionsById: VoteDescriptionsMap = {};
  for (const [voteId, entry] of Object.entries(raw)) {
    if (isValidEntry(entry)) {
      descriptionsById[voteId] = entry;
    }
  }
  return descriptionsById;
};
