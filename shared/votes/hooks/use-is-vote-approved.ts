import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { AragonVoting } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';

// TODO: replace with onchain check
const LAST_APPROVED_VOTE_ID: Record<string, number> = {
  [getContractAddress(AragonVoting, CHAINS.Mainnet)]: 207,
  [getContractAddress(AragonVoting, CHAINS.Hoodi)]: 91,
  [getContractAddress(AragonVoting, CHAINS.Hoodi, true)]: 427,
};

export const useIsVoteApproved = (voteId: number) => {
  const votingAddress = useContractAddress(AragonVoting);
  const lastApprovedVoteId = LAST_APPROVED_VOTE_ID[votingAddress];

  return lastApprovedVoteId !== undefined && voteId <= lastApprovedVoteId;
};
