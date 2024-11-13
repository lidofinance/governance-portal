import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();
  const { readContract } = useReadContract(DualGovernance);

  const { data, isLoading } = useQuery({
    queryKey: ['dg-escrow-addresses', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      const vetoSignallingAddress = await readContract(
        'getVetoSignallingEscrow',
      );

      const rageQuitAddress = await readContract('getRageQuitEscrow');

      return {
        vetoSignallingAddress,
        rageQuitAddress,
      };
    },
  });

  return {
    vetoSignallingAddress: data?.vetoSignallingAddress,
    rageQuitAddress: data?.rageQuitAddress,
    isLoading,
  };
};
