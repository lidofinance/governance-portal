import { useMemo } from 'react';

import { useEthPrice } from '@lido-sdk/react';
import { formatEther } from 'viem';

// TODO: get rid of swr
export const useEthUsd = (amount: bigint | null | undefined) => {
  const { data: price, loading } = useEthPrice({
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    refreshInterval: 5 * 60 * 1000,
  });

  const usdAmount = useMemo(() => {
    if (price && amount != null) {
      const txCostInEth = parseFloat(formatEther(amount));
      return txCostInEth * price;
    }
    return undefined;
  }, [amount, price]);

  return {
    usdAmount,
    price,
    isLoading: loading,
  };
};
