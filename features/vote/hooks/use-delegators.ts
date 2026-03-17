import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';
import { Address } from 'viem';
import { fetchDelegateData } from '../utils/fetch-delegate-data';

type DelegatedVoter = {
  address: Address;
  balance: bigint;
  ensName?: string | null;
};

type DelegatorsData = {
  delegatedVoters: DelegatedVoter[];
  totalDelegatedVotingPower: bigint;
};

/*
  Fetches all delegated voters for the connected wallet address.
  Returns their addresses and voting power, sorted by balance descending.
*/
export const useDelegators = () => {
  const { address } = useAccount();
  const { chainId } = useLidoSDK();
  const votingContract = useReadContract(Voting);
  // TODO: add ENS support
  // const { lookupAddress } = useEnsResolvers();

  return useQuery<DelegatorsData | undefined>({
    queryKey: [`use-delegators`, chainId, address, votingContract.address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) {
        return;
      }

      const {
        delegatedVotersAddresses,
        delegatedVotersVotingPower,
        totalDelegatedVotingPower,
      } = await fetchDelegateData(votingContract, address);

      const delegatedVoters = delegatedVotersAddresses
        .map((delegatorAddress, index) => ({
          address: delegatorAddress,
          balance: delegatedVotersVotingPower[index],
        }))
        .sort((a, b) => {
          // Sort delegators by voting power in descending order
          if (a.balance > b.balance) return -1;
          if (a.balance < b.balance) return 1;
          return 0;
        });

      return {
        delegatedVoters,
        totalDelegatedVotingPower,
      };
    },
  });
};
