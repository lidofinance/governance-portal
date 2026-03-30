import { Address } from 'viem';
import { VoteMode } from '@vote/types';

export type VoteTxArgs = {
  voteId: bigint;
  mode: VoteMode;
  delegatedVoters?: Address[];
};
