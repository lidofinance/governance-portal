import { useMemo } from 'react';
import { useEthUsd } from './use-eth-usd';
import { useMaxGasPrice } from './use-max-gas-price';

export const useTxCostUsd = (gasLimit: bigint | undefined) => {
  const { data: gasPrice, isLoading: isGasPriceLoading } = useMaxGasPrice();

  const ethAmount = useMemo(() => {
    if (!gasPrice || !gasLimit) return undefined;
    return gasPrice * gasLimit;
  }, [gasLimit, gasPrice]);

  const { usdAmount, isLoading: isEthPriceLoading } = useEthUsd(ethAmount);

  return {
    ethAmount,
    usdAmount,
    maxGasPrice: gasPrice,
    isLoading: isGasPriceLoading || isEthPriceLoading,
  };
};
