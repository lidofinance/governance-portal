import { Vote, VoteStatus } from 'shared/votes/types';
import { formatUnits } from 'viem';

const EMPTY_SCRIPT = '0x00000001';

const isVoteEnactable = (vote: Vote): boolean | string => {
  return vote.script && vote.script !== EMPTY_SCRIPT;
};

const isQuorumReached = (vote: Vote): boolean => {
  const totalSupply = Number(
    formatUnits(vote.votingPower as unknown as bigint, 18),
  );
  const yeaNum = Number(formatUnits(vote.yea as unknown as bigint, 18));
  const nayNum = Number(formatUnits(vote.nay as unknown as bigint, 18));
  const minAcceptQuorum = Number(
    formatUnits(vote.minAcceptQuorum as unknown as bigint, 18),
  );

  const yeaQuorum = yeaNum / totalSupply;
  const nayQuorum = nayNum / totalSupply;

  return yeaQuorum > minAcceptQuorum || nayQuorum > minAcceptQuorum;
};

export const getVoteStatus = (
  vote: Vote | undefined | null,
  canExecute: boolean | undefined | null,
): { status: VoteStatus; isQuorumReached: boolean } | null => {
  if (!vote) return null;

  const { open, executed, phase } = vote;

  if (!open) {
    if (executed) {
      return {
        status: VoteStatus.Executed,
        isQuorumReached: isQuorumReached(vote),
      };
    }

    if (canExecute && !isVoteEnactable(vote)) {
      return {
        status: VoteStatus.Passed,
        isQuorumReached: isQuorumReached(vote),
      };
    }

    if (canExecute && isVoteEnactable(vote)) {
      return {
        status: VoteStatus.Pending,
        isQuorumReached: isQuorumReached(vote),
      };
    }

    return {
      status: VoteStatus.Rejected,
      isQuorumReached: isQuorumReached(vote),
    };
  }

  if (!executed && phase === 1) {
    return {
      status: VoteStatus.ActiveObjection,
      isQuorumReached: isQuorumReached(vote),
    };
  }

  return {
    status: VoteStatus.ActiveMain,
    isQuorumReached: isQuorumReached(vote),
  };
};
