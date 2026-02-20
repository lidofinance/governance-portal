import { Vote, VoteStatus } from 'shared/votes/types';
import { formatEther } from 'viem';

const EMPTY_SCRIPT = '0x00000001';

const isVoteEnactable = (vote: Pick<Vote, 'script'>): boolean | string => {
  return vote.script && vote.script !== EMPTY_SCRIPT;
};

const isQuroumReached = (
  vote: Pick<Vote, 'votingPower' | 'yea' | 'nay' | 'minAcceptQuorum'>,
): boolean => {
  const totalSupply = Number(formatEther(vote.votingPower));
  const yeaNum = Number(formatEther(vote.yea));
  const nayNum = Number(formatEther(vote.nay));
  const minAcceptQuorum = Number(formatEther(vote.minAcceptQuorum));

  const yeaQuorum = yeaNum / totalSupply;
  const nayQuorum = nayNum / totalSupply;

  return yeaQuorum > minAcceptQuorum || nayQuorum > minAcceptQuorum;
};

export const getVoteState = (
  vote: Omit<Vote, 'state'>,
  canExecute: boolean | undefined | null,
): { status: VoteStatus; isQuorumReached: boolean } => {
  const { open, executed, phase } = vote;

  if (!open) {
    if (executed) {
      return {
        status: VoteStatus.Executed,
        isQuorumReached: isQuroumReached(vote),
      };
    }

    if (canExecute && !isVoteEnactable(vote)) {
      return {
        status: VoteStatus.Passed,
        isQuorumReached: isQuroumReached(vote),
      };
    }

    if (canExecute && isVoteEnactable(vote)) {
      return {
        status: VoteStatus.Pending,
        isQuorumReached: isQuroumReached(vote),
      };
    }

    return {
      status: VoteStatus.Rejected,
      isQuorumReached: isQuroumReached(vote),
    };
  }

  if (!executed && phase === 1) {
    return {
      status: VoteStatus.ActiveObjection,
      isQuorumReached: isQuroumReached(vote),
    };
  }

  return {
    status: VoteStatus.ActiveMain,
    isQuorumReached: isQuroumReached(vote),
  };
};
