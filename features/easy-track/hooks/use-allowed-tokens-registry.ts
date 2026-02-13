import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { erc20Abi } from 'abi/generated';
import { processInBatches } from 'utils/process-in-batches';
import { AllowedTokensRegistry } from 'shared/blockchain/contracts';

const MAX_PROVIDER_BATCH = 20;

export const useAllowedTokens = () => {
  const { chainId } = useLidoSDK();
  const connectErc20Contract = useReadContractGetter(erc20Abi);
  const tokenRegistry = useReadContract(AllowedTokensRegistry);

  const { data, isLoading } = useQuery({
    queryKey: [`allowed-tokens`, chainId],
    queryFn: async () => {
      const tokensAddresses =
        await tokenRegistry.readContract('getAllowedTokens');

      const results = await processInBatches(
        [...tokensAddresses],
        MAX_PROVIDER_BATCH,
        async (tokenAddress) => {
          const tokenContract = connectErc20Contract(tokenAddress);

          const [label, decimals] = await Promise.all([
            tokenContract('symbol'),
            tokenContract('decimals'),
          ]);

          return { address: tokenAddress, label, decimals };
        },
      );

      const allowedTokens = [];
      const tokensDecimalsMap: Record<string, number | undefined> = {};

      for (const result of results) {
        if (result.status === 'fulfilled') {
          const token = result.value;
          allowedTokens.push(token);
          tokensDecimalsMap[token.address] = token.decimals;
        } else {
          console.error('Failed to fetch token info:', result.reason);
        }
      }
      return { allowedTokens, tokensDecimalsMap };
    },
  });

  return {
    allowedTokens: data?.allowedTokens,
    tokensDecimalsMap: data?.tokensDecimalsMap,
    isLoading,
  };
};
