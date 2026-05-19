import { ProposalEventsSubset } from '../proposals/types';
import { MAX_PROPOSAL_IDS } from 'constants/api';

const fetchProposalEventsBatch = async (
  chainId: number,
  proposalIds: (string | number)[],
): Promise<ProposalEventsSubset> => {
  const ids = proposalIds.map(String).join(',');

  try {
    const response = await fetch(
      `/api/proposals/events?chainId=${chainId}&proposalIds=${encodeURIComponent(ids)}`,
    );

    if (!response.ok) {
      if (response.status !== 404) {
        console.warn(
          'fetchCachedProposalEvents: unexpected status',
          response.status,
          response.statusText,
        );
      }
      return {};
    }

    return (await response.json()) as ProposalEventsSubset;
  } catch (err) {
    console.warn('fetchCachedProposalEvents: network error', err);
    return {};
  }
};

export const fetchCachedProposalEvents = async (
  chainId: number,
  proposalIds: (string | number)[],
): Promise<ProposalEventsSubset> => {
  if (proposalIds.length === 0) {
    return {};
  }

  // The API route caps proposalIds at MAX_PROPOSAL_IDS. Chunk longer lists so a
  // large proposal count doesn't trip a 400 and silently degrade to per-id RPC.
  // Chunk count is ceil(n / MAX_PROPOSAL_IDS) — inherently small, so parallel.
  const chunks: (string | number)[][] = [];
  for (let i = 0; i < proposalIds.length; i += MAX_PROPOSAL_IDS) {
    chunks.push(proposalIds.slice(i, i + MAX_PROPOSAL_IDS));
  }

  const results = await Promise.all(
    chunks.map((chunk) => fetchProposalEventsBatch(chainId, chunk)),
  );

  const merged: ProposalEventsSubset = {};
  for (const result of results) {
    Object.assign(merged, result);
  }

  return merged;
};
