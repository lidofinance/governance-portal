import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  NODE_OPERATORS_REGISTRY_MAP,
  NodeOperatorsRegistryType,
} from '../motion-card-description/types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { getSdvtOperatorManagerAddress } from '../utils/get-sdvt-operator-manager-address';
import { NodeOperator } from '../types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const useNodeOperatorsList = (
  registryType: NodeOperatorsRegistryType,
) => {
  const { chainId } = useLidoSDK();

  const registry = NODE_OPERATORS_REGISTRY_MAP[registryType];
  const registryContract = useReadContract(registry);

  return useQuery({
    queryKey: [String(chainId), registryType, 'operators-list'],
    enabled: chainId === CHAINS.Mainnet ? registryType !== 'sandbox' : true,
    queryFn: async () => {
      try {
        const count = await registryContract.readContract(
          'getNodeOperatorsCount',
        );
        const indexes = Array.from(Array.from({ length: Number(count) })).map(
          (_, i) => i,
        );

        const fetchNodeOperator = async (i: number) => {
          const nodeOperator = await registryContract.readContract(
            'getNodeOperator',
            [BigInt(i), true],
          );
          let managerAddress: string | undefined;
          if (registryType === 'sdvt') {
            managerAddress = getSdvtOperatorManagerAddress(chainId, i);
          }
          return { ...nodeOperator, id: i, managerAddress };
        };

        const results = await Promise.allSettled(
          indexes.map(fetchNodeOperator),
        );

        return results
          .map((result) => {
            if (result.status === 'fulfilled') {
              const resultMap = {
                id: result.value.id,
                active: result.value[0],
                name: result.value[1],
                rewardAddress: result.value[2],
                totalVettedValidators: result.value[3],
                totalExitedValidators: result.value[4],
                totalAddedValidators: result.value[5],
                totalDepositedValidators: result.value[6],
              };

              if (registryType === 'sdvt') {
                return {
                  ...resultMap,
                  managerAddress: result.value.managerAddress,
                };
              }
              return resultMap;
            }
            console.error('Failed to fetch node operator:', result.reason);
            return null;
          })
          .filter(Boolean) as unknown as NodeOperator[];
      } catch (error) {
        return [];
      }
    },
  });
};
