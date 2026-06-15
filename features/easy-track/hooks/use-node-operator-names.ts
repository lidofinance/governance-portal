import { useQuery } from '@tanstack/react-query';
import {
  metaRegistryAbi,
  nodeOperatorsRegistryAbi,
  stakingModuleAbi,
} from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address, zeroAddress } from 'viem';

export const useNodeOperatorNames = (
  stakingModuleAddress: Address | undefined,
  operatorIds: bigint[] | readonly bigint[],
) => {
  const { chainId } = useLidoSDK();
  const getStakingModuleReader = useReadContractGetter(stakingModuleAbi);
  const getMetaRegistryReader = useReadContractGetter(metaRegistryAbi);
  const getNodeOperatorsRegistryReader = useReadContractGetter(
    nodeOperatorsRegistryAbi,
  );

  return useQuery({
    queryKey: [
      'node-operator-names',
      stakingModuleAddress,
      chainId,
      operatorIds.join('-'),
    ],
    staleTime: Infinity,
    enabled: stakingModuleAddress !== undefined && operatorIds.length > 0,
    queryFn: async () => {
      if (stakingModuleAddress === undefined || operatorIds.length === 0) {
        return [];
      }

      const readStakingModule = getStakingModuleReader(stakingModuleAddress);

      const metaRegistryAddress = await readStakingModule('META_REGISTRY');

      if (metaRegistryAddress !== null && metaRegistryAddress !== zeroAddress) {
        const readMetaRegistry = getMetaRegistryReader(metaRegistryAddress);

        return Promise.all(
          operatorIds.map(async (nodeOperatorId) => {
            const nodeOperator = await readMetaRegistry('getOperatorMetadata', [
              nodeOperatorId,
            ]);

            return typeof nodeOperator?.name === 'string'
              ? nodeOperator.name
              : '';
          }),
        );
      }

      // Got old staking module implementation, use fallback path to get names
      const readNodeOperatorsRegistry =
        getNodeOperatorsRegistryReader(stakingModuleAddress);

      return Promise.all(
        operatorIds.map(async (nodeOperatorId) => {
          const nodeOperator = await readNodeOperatorsRegistry(
            'getNodeOperator',
            [nodeOperatorId, false],
          );

          return typeof nodeOperator[1] === 'string' ? nodeOperator[1] : '';
        }),
      );
    },
  });
};
