import { Text } from 'shared/components/text';
import {
  AdditionalInfoLoader,
  SummaryRow,
  SupportFormAdditionalInfoStyled,
} from './style';
import { useSupportFormDataContext } from './support-form-context';
import { useTokenTotalSupply } from 'shared/blockchain/hooks/use-total-supply';
import { useFormContext } from 'react-hook-form';
import { formatNumber } from 'shared/blockchain/utils';
import { InlineLoader } from '@lidofinance/lido-ui';

const calculateSupplyPercentage =
  (amount: bigint | null) => (totalSupply: bigint) => {
    if (!amount || !totalSupply) return '0';
    const value = Number((amount * 10000n) / totalSupply) / 100;
    return formatNumber({ value, maxFractionDigits: 2 });
  };

export const SupportFormAdditionalInfo = () => {
  const { activeToken } = useSupportFormDataContext();

  const { watch } = useFormContext();
  const amount = watch('amount');

  const { data: supplyPercent, isLoading: isTotalSupplyLoading } =
    useTokenTotalSupply(activeToken, calculateSupplyPercentage(amount));

  return (
    <SupportFormAdditionalInfoStyled>
      <SummaryRow>
        <Text size={14} color="secondary">
          Percent of total {activeToken} supply
        </Text>
        {isTotalSupplyLoading ? (
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
        <Text size={14} color="secondary">
          0.000212 ETH ($10.62)
        </Text>
      </SummaryRow>
    </SupportFormAdditionalInfoStyled>
  );
};
