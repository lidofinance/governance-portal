import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { AragonVoting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useAccount } from 'wagmi';

export const useIsDelegate = () => {
  const { chainId } = useLidoSDK();
  const { address } = useAccount();
  const votingContract = useReadContract(AragonVoting);

  return useQuery({
    queryKey: [`is-delegate`, chainId, address, votingContract.address],
    queryFn: async () => {
      if (!address) {
        return;
      }

      const delegatorsCount = await votingContract.readContract(
        'getDelegatedVotersCount',
        [address],
      );

      return delegatorsCount > 0n;
    },
    enabled: !!address,
  });
};
