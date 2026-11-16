import voteDurations from 'public/votes-events/durations.json';

type VoteDurations = {
  lastVoteId?: number;
  voteTime: number;
  objectionPhaseTime: number;
};

// Maintained by `yarn build-vote-events`: ranges of vote ids by the durations
// they ran under. The open-ended last range is skipped so that newer votes use
// the live `Voting.voteTime()` / `objectionPhaseTime()`.
export const VOTE_DURATIONS: Record<
  string,
  Record<string, VoteDurations[]>
> = voteDurations;
