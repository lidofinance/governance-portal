import { PUBLIC_DELEGATES } from '../public-delegates';
import { PublicDelegate } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { formatToken } from 'shared/blockchain/utils';
import { fetchDelegateData } from '../utils/fetch-delegate-data';
import { KnownToken } from 'shared/blockchain/tokens';

export type ProcessedDelegate = PublicDelegate & {
  delegatorsCount: number;
  delegatedVotingPower: bigint;
  delegatedVotingPowerFormatted: string;
};

export const useProcessedPublicDelegatesList = () => {
  const { chainId } = useLidoSDK();
  const votingContract = useReadContract(Voting);

  return useQuery({
    queryKey: [
      'use-processed-public-delegates-list',
      chainId,
      votingContract.address,
    ],
    queryFn: async () => {
      const parsedList: ProcessedDelegate[] = await Promise.all(
        PUBLIC_DELEGATES.map(async (delegate) => {
          const { delegatedVotersCount, totalDelegatedVotingPower } =
            await fetchDelegateData(votingContract, delegate.address);

          return {
            ...delegate,
            delegatorsCount: delegatedVotersCount,
            delegatedVotingPower: totalDelegatedVotingPower,
            delegatedVotingPowerFormatted: formatToken({
              amount: totalDelegatedVotingPower,
              notation: 'compact',
              maxFractionDigits: 2,
              decimals: KnownToken.LDO.decimals,
            }),
          };
        }),
      );

      return parsedList.sort((a, b) => {
        if (a.delegatedVotingPower < b.delegatedVotingPower) {
          return 1;
        }
        if (a.delegatedVotingPower > b.delegatedVotingPower) {
          return -1;
        }

        return a.name.localeCompare(b.name);
      });
    },
    staleTime: Infinity,
  });
};
