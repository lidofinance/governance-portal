import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { dgConfigProviderAbi } from 'abi/ts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { DualGovernance } from 'shared/blockchain/contracts';

export const useDualGovernanceConfig = () => {
  const { chainId } = useLidoSDK();
  const dualGovernance = useReadContract(DualGovernance);
  const readConfigContract = useReadContractGetter(dgConfigProviderAbi);

  return useQuery({
    queryKey: ['dual-governance-config', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      const configAddress =
        await dualGovernance.readContract('getConfigProvider');

      return readConfigContract(configAddress)('getDualGovernanceConfig');
    },
  });
};
