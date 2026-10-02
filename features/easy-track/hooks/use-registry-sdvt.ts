import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { SDVTRegistry } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';

export const useSDVTOperatorsCounts = () => {
  const { chainId } = useLidoSDK();
  const registryContract = useReadContract(SDVTRegistry);

  return useQuery({
    queryKey: ['sdvt-operators-counts', chainId, registryContract.address],
    queryFn: async () => {
      const [current, max] = await Promise.all([
        registryContract.readContract('getNodeOperatorsCount'),
        registryContract.readContract('MAX_NODE_OPERATORS_COUNT'),
      ]);
      return { current: Number(current), max: Number(max) };
    },
  });
};

export const useSDVTOperatorNameLimit = () => {
  const { chainId } = useLidoSDK();
  const registryContract = useReadContract(SDVTRegistry);

  return useQuery({
    queryKey: ['sdvt-operator-name-length', chainId, registryContract.address],
    queryFn: async () =>
      registryContract.readContract('MAX_NODE_OPERATOR_NAME_LENGTH'),
  });
};
