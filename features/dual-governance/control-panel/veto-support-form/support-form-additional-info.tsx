import { Text } from 'shared/components/text';
import {
  SummaryRow,
  AdditionalInfoLoader,
  SupportFormAdditionalInfoStyled,
} from './style';
import { useFormContext } from 'react-hook-form';
import { formatEthFull, formatNumber } from 'shared/blockchain/utils';
import { useLockTxGas } from './use-lock-tx-gas';
import { useTxCostUsd } from 'shared/blockchain/hooks/use-tx-cost-usd';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { useSupportFormDataContext } from './support-form-context';
import { Token } from 'shared/blockchain/types';

export const SupportFormAdditionalInfo = () => {
  const { watch } = useFormContext();
  const { selectedToken, networkData } = useSupportFormDataContext();
  const { amount, selectedNftIds } = watch();

  const { stEthTotalSupply, isLoading } = useDualGovernanceContext();

  const supplyPercent = useMemo(() => {
    if (!stEthTotalSupply) return '0';

    let amountToSupport: bigint = amount;

    if (selectedToken === Token.unstETH) {
      const { withdrawalRequests } = networkData;
      const selectedNftIdsArray = Object.keys(selectedNftIds);
      if (!withdrawalRequests || selectedNftIdsArray.length === 0) return '0';

      amountToSupport = selectedNftIdsArray.reduce(
        (acc, key) => acc + (withdrawalRequests[key] ?? 0n),
        0n,
      );
    }

    if (!amountToSupport) return '0';

    const value = Number((amountToSupport * 10000n) / stEthTotalSupply) / 100;
    return formatNumber({ value, maxFractionDigits: 2 });
  }, [amount, networkData, selectedNftIds, selectedToken, stEthTotalSupply]);

  const { estimatedGas, isLoading: isEstimatedGasLoading } = useLockTxGas();

  const {
    ethAmount,
    usdAmount,
    isLoading: isTxCostLoading,
  } = useTxCostUsd(estimatedGas);

  return (
    <SupportFormAdditionalInfoStyled>
      <SummaryRow>
        <Text size={14} color="secondary">
          Percent of total stETH supply
        </Text>
        {isLoading ? (
          <AdditionalInfoLoader />
        ) : (
          <Text size={14} color="secondary">
            {supplyPercent}%
          </Text>
        )}
      </SummaryRow>
      <SummaryRow>
        <Text size={14} color="secondary">
          Max transaction cost
        </Text>
        {isEstimatedGasLoading || isTxCostLoading ? (
          <AdditionalInfoLoader />
        ) : (
          <Text size={14} color="secondary">
            {formatEthFull(ethAmount)} ETH ($
            {formatNumber({ value: usdAmount })})
          </Text>
        )}
      </SummaryRow>
    </SupportFormAdditionalInfoStyled>
  );
};
