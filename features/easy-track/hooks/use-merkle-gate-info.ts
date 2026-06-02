import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { merkleGateAbi } from 'abi/generated';

export const useMerkleGateInfo = (
  gateAddress: Address | null | undefined,
  isEnabled = true,
) => {
  const { chainId } = useLidoSDK();
  const getMerkleGateReader = useReadContractGetter(merkleGateAbi);

  return useQuery({
    queryKey: ['merkle-gate-info', chainId, gateAddress],
    enabled: !!gateAddress && isEnabled,
    queryFn: async () => {
      if (!gateAddress) {
        return;
      }

      const readMerkleGate = getMerkleGateReader(gateAddress);
      const [treeRoot, treeCid] = await Promise.all([
        readMerkleGate('treeRoot'),
        readMerkleGate('treeCid'),
      ]);

      return {
        treeRoot,
        treeCid,
      };
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
