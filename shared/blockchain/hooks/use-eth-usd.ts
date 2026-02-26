import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { aggregatorAbi } from 'abi/generated';
import { useReadContractGetter } from './use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';
import { aggregatorEthUsdPriceFeed } from '../../price-feed-addresses';

export const useEthUsd = (amount: bigint | undefined, enabled = true) => {
  const aggregatorContract = useReadContractGetter(aggregatorAbi);
  const { rpcProvider, chainId } = useLidoSDK();

  const {
    data: price,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['eth-usd-price', chainId],
    enabled: !!rpcProvider && enabled,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      invariant(rpcProvider, '[useEthUsd] The "rpcProvider" must be defined');

      const [latestAnswer, decimals] = await Promise.all([
        aggregatorContract(aggregatorEthUsdPriceFeed)('latestAnswer'),
        aggregatorContract(aggregatorEthUsdPriceFeed)('decimals'),
      ]);

      const ethPrice = Number(latestAnswer) / 10 ** Number(decimals);

      return ethPrice;
    },
  });

  const usdAmount = useMemo(() => {
    if (price != null && amount != null) {
      const amountStr = amount.toString();
      const txCostInEth = Number(amountStr) / 10 ** 18;
      return txCostInEth * price;
    }
    return undefined;
  }, [amount, price]);

  return {
    usdAmount,
    price,
    isLoading,
    error,
    isFetching,
    update: refetch,
  };
};
