import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { SDVTRegistry } from 'shared/blockchain/contracts';
import { useNodeOperatorsList } from './use-node-operators-list';
import { processInBatches } from 'utils/process-in-batches';
import { useQuery } from '@tanstack/react-query';

type NodeOperatorSummary = {
  targetValidatorsCount: bigint;
  stuckValidatorsCount: bigint;
  refundedValidatorsCount: bigint;
  stuckPenaltyEndTimestamp: bigint;
  totalExitedValidators: bigint;
  totalDepositedValidators: bigint;
  depositableValidatorsCount: bigint;
  targetLimitMode: bigint;
};

const MAX_PROVIDER_BATCH = 20;

export const useSDVTNodeOperatorsSummaryMap = () => {
  const { chainId } = useLidoSDK();
  const registry = useReadContract(SDVTRegistry);
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');

  return useQuery({
    queryKey: ['nodeOperatorsList', chainId, registry.address],
    queryFn: async () => {
      if (!Array.isArray(nodeOperatorsList) || nodeOperatorsList.length === 0) {
        return {};
      }
      const results = await processInBatches(
        nodeOperatorsList,
        MAX_PROVIDER_BATCH,
        async (nodeOperator) => {
          const summaryTuple = await registry.readContract(
            'getNodeOperatorSummary',
            [BigInt(nodeOperator.id)],
          );
          const [
            targetValidatorsCount,
            stuckValidatorsCount,
            refundedValidatorsCount,
            stuckPenaltyEndTimestamp,
            totalExitedValidators,
            totalDepositedValidators,
            depositableValidatorsCount,
            targetLimitMode,
          ] = summaryTuple;
          const summary: NodeOperatorSummary = {
            targetValidatorsCount,
            stuckValidatorsCount,
            refundedValidatorsCount,
            stuckPenaltyEndTimestamp,
            totalExitedValidators,
            totalDepositedValidators,
            depositableValidatorsCount,
            targetLimitMode,
          };
          return { id: nodeOperator.id, summary };
        },
      );

      const summaryMap: Record<number, NodeOperatorSummary> = {};

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { id, summary } = result.value;
          summaryMap[id] = summary;
        } else {
          console.error(
            'Failed to fetch node operator summary:',
            result.reason,
          );
        }
      }

      return summaryMap;
    },
  });
};
