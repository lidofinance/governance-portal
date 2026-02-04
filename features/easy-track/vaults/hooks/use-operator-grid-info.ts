import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';

export const useOperatorGridInfo = () => {
  const { chainId } = useLidoSDK();
  const operatorGrid = useReadContract(OperatorGrid);

  return useQuery({
    queryKey: ['operator-grid-info', chainId],
    queryFn: async () => {
      const [tiersCount, nodeOperatorCount] = await Promise.all([
        operatorGrid.readContract('tiersCount'),
        operatorGrid.readContract('nodeOperatorCount'),
      ]);
      return {
        tiersCount: Number(tiersCount),
        nodeOperatorCount: Number(nodeOperatorCount),
      };
    },
  });
};
