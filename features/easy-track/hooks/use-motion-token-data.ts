import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { erc20Abi } from 'abi/generated/ERC20';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export const useMotionTokenData = (
  tokenAddress: Address | null | undefined,
) => {
  const { chainId } = useLidoSDK();
  const connectErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery({
    queryKey: ['motion-token-data', tokenAddress, chainId],
    queryFn: async () => {
      if (!tokenAddress?.length) {
        return null;
      }

      const tokenContract = connectErc20Contract(tokenAddress);
      const label = await tokenContract('symbol');
      const decimals = await tokenContract('decimals');

      if (label === null || decimals === null) {
        throw new Error(`Failed to read metadata of token ${tokenAddress}`);
      }

      return {
        label,
        address: tokenAddress,
        decimals,
      };
    },
    enabled: !!tokenAddress && tokenAddress.length > 0,
  });
};
