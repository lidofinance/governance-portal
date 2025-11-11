import { NodeOperator } from '../types';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  NODE_OPERATORS_REGISTRY_MAP,
  NodeOperatorsRegistryType,
} from '../motion-card-description/types';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

const BATCH_SIZE = 50;

export const useNodeOperatorsList = (
  registryType: NodeOperatorsRegistryType,
) => {
  const { chainId } = useLidoSDK();
  const registry = useReadContract(NODE_OPERATORS_REGISTRY_MAP[registryType]);

  return useQuery({
    queryKey: ['node-operators-list', chainId, registryType, registry.address],
    queryFn: async () => {
      try {
        const count = (await registry.readContract(
          'getNodeOperatorsCount',
        )) as bigint;
        const totalCount = Number(count);

        if (totalCount === 0) {
          return [];
        }
        const indexes = Array.from({ length: totalCount }, (_, i) => i);

        const nodeOperators: NodeOperator[] = [];

        for (let i = 0; i < indexes.length; i += BATCH_SIZE) {
          const batch = indexes.slice(i, i + BATCH_SIZE);

          const batchResults = await Promise.allSettled(
            batch.map(async (operatorId) => {
              const result = (await registry.readContract('getNodeOperator', [
                operatorId,
                true, // fullInfo
              ])) as [
                boolean, // active
                string, // name
                string, // rewardAddress
                bigint, // totalVettedValidators
                bigint, // totalExitedValidators
                bigint, // totalAddedValidators
                bigint, // totalDepositedValidators
              ];

              const nodeOperator: NodeOperator = {
                id: operatorId,
                active: result[0],
                name: result[1],
                rewardAddress: result[2],
                totalVettedValidators: result[3],
                totalExitedValidators: result[4],
                totalAddedValidators: result[5],
                totalDepositedValidators: result[6],
              };

              // For SDVT, fetch manager address if needed
              if (registryType === 'sdvt') {
                try {
                  nodeOperator.managerAddress = (await registry.readContract(
                    'getNodeOperatorManager',
                    [operatorId],
                  )) as string;
                } catch (error) {
                  console.warn(
                    `Failed to fetch manager for operator ${operatorId}:`,
                    error,
                  );
                }
              }

              return nodeOperator;
            }),
          );

          // Process batch results
          batchResults.forEach((result) => {
            if (result.status === 'fulfilled') {
              nodeOperators.push(result.value);
            } else {
              console.error('Failed to fetch node operator:', result.reason);
            }
          });
        }

        return nodeOperators;
      } catch (error) {
        console.error('Error fetching node operators list:', error);
        return [];
      }
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
