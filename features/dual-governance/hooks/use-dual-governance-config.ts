import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { DualGovernance } from 'shared/blockchain/contracts';
import { DualGovernanceConfig } from '../types';
import { dgConfigProviderAbi } from 'abi/ts';

export const useDualGovernanceConfig = (): UseQueryResult<
  DualGovernanceConfig,
  Error
> => {
  const { chainId } = useLidoSDK();
  const readDualGovernanceContract = useReadContract(DualGovernance);
  const readConfigContract = useReadContractGetter(dgConfigProviderAbi);

  return useQuery({
    queryKey: ['dual-governance-config', chainId],
    staleTime: 300000, // 5 minutes
    queryFn: async () => {
      const configAddress =
        await readDualGovernanceContract.readContract('getConfigProvider');
      if (!configAddress) {
        throw new Error('Failed to get config provider address');
      }

      return readConfigContract(configAddress)('getDualGovernanceConfig');
    },
  });
};
