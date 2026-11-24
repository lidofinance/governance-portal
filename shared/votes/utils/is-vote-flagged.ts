import { config } from 'config';

// `?? []`: a window-env.js cached before FLAGGED_VOTES existed leaves it undefined
const flaggedVotes = (config.flaggedVotes ?? []).flatMap(
  (entry): [number, number][] => {
    const match = entry.match(/^(\d+)\s*:\s*(\d+)$/);
    return match ? [[Number(match[1]), Number(match[2])]] : [];
  },
);

export const isVoteFlagged = (chainId: number, voteId: number) =>
  flaggedVotes.some(([chain, vote]) => chain === chainId && vote === voteId);

export const getFlaggedVoteIds = (chainId: number) =>
  flaggedVotes.filter(([chain]) => chain === chainId).map(([, vote]) => vote);
