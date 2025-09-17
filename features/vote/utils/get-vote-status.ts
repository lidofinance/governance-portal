import { Vote, VoteStatus } from 'shared/votes/types';
import { isVoteEnactable } from './is-vote-enactable';

type Args = Pick<Vote, 'open' | 'executed' | 'phase' | 'canExecute' | 'script'>;

export const getVoteStatus = ({
  open,
  executed,
  phase,
  canExecute,
  script,
}: Args) => {
  if (!open) {
    if (executed) return VoteStatus.Executed;
    if (canExecute && !isVoteEnactable(script)) return VoteStatus.Passed;
    if (canExecute && isVoteEnactable(script)) return VoteStatus.Pending;
    return VoteStatus.Rejected;
  }

  if (!executed && phase === 1) {
    return VoteStatus.ActiveObjection;
  }

  return VoteStatus.ActiveMain;
};
