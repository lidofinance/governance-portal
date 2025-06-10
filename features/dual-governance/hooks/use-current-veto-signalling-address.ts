import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { Address } from 'viem';

export const useCurrentVetoSignallingAddress = (): UseQueryResult<
  Address,
  Error
> => {
  const { chainId } = useLidoSDK();
  const readDualGovernanceContract = useReadContract(DualGovernance);

  return useQuery({
    queryKey: ['current-veto-signalling-address', chainId],
    staleTime: 5000,
    queryFn: async () => {
      try {
        return await readDualGovernanceContract.readContract(
          'getVetoSignallingEscrow',
        );
      } catch (e) {
        throw new Error(`Failed to get VetoSignallingEscrow address: ${e}`);
      }
    },
  });
};
