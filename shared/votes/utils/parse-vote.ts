import { Vote, RawVote, VotePhase } from '../types';
import { getVoteState } from './get-vote-state';

export const parseVote = (
  voteId: number,
  vote: RawVote,
  canExecute: boolean,
): Vote => {
  const voteObject = {
    id: voteId,
    open: vote[0],
    executed: vote[1],
    startDate: vote[2],
    snapshotBlock: vote[3],
    supportRequired: vote[4],
    minAcceptQuorum: vote[5],
    yea: vote[6],
    nay: vote[7],
    votingPower: vote[8],
    script: vote[9],
    phase:
      vote[10] === 0
        ? VotePhase.Main
        : vote[10] === 1
          ? VotePhase.Objection
          : VotePhase.Closed,
    canExecute,
  };

  return {
    ...voteObject,
    state: getVoteState(voteObject, canExecute),
  };
};
