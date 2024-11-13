import { Text } from 'shared/components/text';
import { SummaryRow, SupportFormAdditionalInfoStyled } from './style';
import { useSupportFormDataContext } from './support-form-context';
import { useTokenTotalSupply } from 'shared/blockchain/hooks/use-total-supply';
import { useFormContext } from 'react-hook-form';

const calculateSupplyPercentage = (amount: string) => (totalSupply: bigint) => {
  const amountBN = BigInt(amount);
  return (amountBN * 100n) / totalSupply;
};

export const SupportFormAdditionalInfo = () => {
  const { activeToken } = useSupportFormDataContext();

  const kek = useFormContext();
  console.log('kek', kek);

  const { data } = useTokenTotalSupply(activeToken);

  return (
    <SupportFormAdditionalInfoStyled>
      <SummaryRow>
        <Text size={14} color="secondary">
          Percent of total {activeToken} supply
        </Text>
        <Text size={14} color="secondary">
          0.31%
        </Text>
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
