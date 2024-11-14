import { useMemo } from 'react';
import { useEthUsd } from './use-eth-usd';
import { useGasPrice } from 'wagmi';

export const useTxCostUsd = (gasLimit: bigint) => {
  const { data: gasPrice, isLoading: isGasPriceLoading } = useGasPrice();

  const ethAmount = useMemo(
    () => (gasPrice && gasLimit ? gasPrice * gasLimit : 0n),
    [gasLimit, gasPrice],
  );
  const { usdAmount, isLoading: isEthPriceLoading } = useEthUsd(ethAmount);

  return {
    ethAmount,
    usdAmount,
    maxGasPrice: gasPrice,
    isLoading: isGasPriceLoading || isEthPriceLoading,
  };
};
