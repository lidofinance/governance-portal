import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { erc20Abi } from 'abi/generated/ERC20';
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

const DEFAULT_DECIMALS = 18;

export const useMotionTokenData = (
  tokenAddress: Address | null | undefined,
) => {
  const { chainId } = useLidoSDK();
  const connectErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery({
    queryKey: ['motion-token-data', tokenAddress, chainId],
    queryFn: async () => {
      if (!tokenAddress?.length) return null;
      try {
        const tokenContract = connectErc20Contract(tokenAddress);
        const label = await tokenContract('symbol');
        const decimals = await tokenContract('decimals');

        return {
          label,
          address: tokenAddress,
          decimals,
        };
      } catch (error) {
        return {
          label: 'Unknown token',
          address: tokenAddress,
          decimals: DEFAULT_DECIMALS,
        };
      }
    },
    enabled: !!tokenAddress && tokenAddress.length > 0,
  });
};
