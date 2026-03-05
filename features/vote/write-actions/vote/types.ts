import { Address } from 'viem';
import { VoteMode } from '../../types';

export type VoteTxArgs = {
  voteId: bigint;
  mode: VoteMode;
  delegatedVoters?: Address[];
};
