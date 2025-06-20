import { useMemo } from 'react';
import { useEthUsd } from './use-eth-usd';
import { useMaxGasPrice } from './use-max-gas-price';
import { useLidoSDK } from 'providers/lido-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const useTxCostUsd = (gasLimit: bigint | undefined) => {
  const { data: gasPrice, isLoading: isGasPriceLoading } = useMaxGasPrice();
  const { chainId } = useLidoSDK();

  const ethAmount = useMemo(() => {
    if (!gasPrice || !gasLimit) return undefined;
    return gasPrice * gasLimit;
  }, [gasLimit, gasPrice]);

  const { usdAmount, isLoading: isEthPriceLoading } = useEthUsd(
    ethAmount,
    chainId === CHAINS.Mainnet,
  );

  return {
    ethAmount,
    usdAmount,
    maxGasPrice: gasPrice,
    isLoading: isGasPriceLoading || isEthPriceLoading,
  };
};
