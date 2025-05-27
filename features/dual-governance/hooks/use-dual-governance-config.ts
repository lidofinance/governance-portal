import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { dgConfigProviderAbi } from 'abi/ts';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useDynamicDualGovernance } from './use-dynamic-dual-governance';

export const useDualGovernanceConfig = () => {
  const { chainId } = useLidoSDK();
  const { readDynamicContract } = useDynamicDualGovernance();
  const readConfigContract = useReadContractGetter(dgConfigProviderAbi);

  return useQuery({
    queryKey: ['dual-governance-config', chainId],
    staleTime: Infinity,
    queryFn: async () => {
      // Get the config provider address from the dynamic DualGovernance contract
      const configAddress = await readDynamicContract('getConfigProvider');
      if (!configAddress) {
        throw new Error('Failed to get config provider address');
      }

      return readConfigContract(configAddress)('getDualGovernanceConfig');
    },
  });
};
