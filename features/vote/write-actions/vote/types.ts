import { Address } from 'viem';
import { VoteMode } from '../../types';

export type ProcessVoteTxArgs = {
  mode: VoteMode;
  voteId: bigint;
};

export type ProcessVoteDelegatedTxArgs = ProcessVoteTxArgs & {
  voters: Address[];
};
