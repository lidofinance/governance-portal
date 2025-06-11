import { Text } from 'shared/components/text';
import {
  SummaryRow,
  AdditionalInfoLoader,
  SupportFormAdditionalInfoStyled,
} from './style';
import { formatEthFull, formatNumber } from 'shared/blockchain/utils';
import { useLockTxGas } from './use-lock-tx-gas';
import { useTxCostUsd } from 'shared/blockchain/hooks/use-tx-cost-usd';

export const SupportFormAdditionalInfo = () => {
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
          Max transaction cost
        </Text>
        {isEstimatedGasLoading || isTxCostLoading ? (
          <AdditionalInfoLoader />
        ) : (
          <Text size={14} color="secondary">
            {ethAmount !== undefined
              ? `${formatEthFull(ethAmount)} ETH`
              : '0 ETH'}
            {usdAmount != null && usdAmount > 0 && (
              <span> (${formatNumber({ value: usdAmount })})</span>
            )}
          </Text>
        )}
      </SummaryRow>
    </SupportFormAdditionalInfoStyled>
  );
};
