import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { ContractObject } from '../types';
import { useQuery } from '@tanstack/react-query';

export const useEstimateGas = (
  contract: ContractObject,
  // TODO: add typeguard
  functionName: string,
) => {
  const { address } = useAccount();
  const { core, chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['estimated-gas', chainId, contract.name, functionName, address],
    staleTime: Infinity,
    enabled: !!address,
    queryFn: async () => {
      const contractAddress = contract.chainAddressMap[chainId];

      if (!contractAddress) {
        throw new Error(`No address for ${contract.name} on chain ${chainId}`);
      }

      return core.rpcProvider.estimateContractGas({
        address: contractAddress,
        abi: contract.abi,
        functionName,
        args: [69420],
        account: address,
      });
    },
  });
};
