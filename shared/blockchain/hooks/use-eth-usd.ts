import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { aggregatorAbi } from 'abi/ts/Aggregator.abi';
import { useReadContractGetter } from './use-read-contract';
import { usePublicClient } from 'wagmi';
import { aggregatorEthUsdPriceFeed } from '../../price-feed-addresses';

export const useEthUsd = (amount: bigint | undefined) => {
  const aggregatorContract = useReadContractGetter(aggregatorAbi);
  const publicClient = usePublicClient();

  const {
    data: price,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['eth-usd-price', publicClient],
    enabled: !!publicClient,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    queryFn: async () => {
      invariant(publicClient, '[useEthUsd] The "publicClient" must be defined');

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
