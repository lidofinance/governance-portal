import { useLidoSDK } from '../../../providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { CSMSetVettedGateTree } from 'shared/blockchain/contracts';
import { csmVettedGateTreeAbi } from 'abi/generated/CSMVettedGateTree';
import { readContract } from 'viem/actions';

export const useCSMVettedGateInfo = () => {
  const { chainId, rpcProvider } = useLidoSDK();
  const factoryContract = useReadContract(CSMSetVettedGateTree);

  return useQuery({
    queryKey: ['vettedGateTree', chainId, factoryContract.address],
    queryFn: async () => {
      const vettedGateAddress =
        await factoryContract.readContract('vettedGate');

      const [treeRoot, treeCid] = await Promise.all([
        readContract(rpcProvider, {
          address: vettedGateAddress,
          abi: csmVettedGateTreeAbi,
          functionName: 'treeRoot',
        }),
        readContract(rpcProvider, {
          address: vettedGateAddress,
          abi: csmVettedGateTreeAbi,
          functionName: 'treeCid',
        }),
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
