import { ProposalEventsSubset } from '../proposals/types';

export const fetchCachedProposalEvents = async (
  chainId: number,
  proposalIds: (string | number)[],
): Promise<ProposalEventsSubset> => {
  if (proposalIds.length === 0) {
    return {};
  }

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
