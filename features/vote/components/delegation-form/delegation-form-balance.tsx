import { Text } from '@lidofinance/lido-ui';
import { useFormState } from 'react-hook-form';
import { Balance, CustomizeButton, DelegationFormBalanceStyled } from './style';
import { useAccount } from 'wagmi';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { formatNumber } from 'shared/blockchain/utils';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';

type Props = {
  onCustomizeClick?: () => void;
};

export const DelegationFormBalance = ({ onCustomizeClick }: Props) => {
  const { daoTokenBalance, loading } = useDelegationFormData();
  const { data: tokenData } = useGovernanceToken();
  const { isConnected } = useAccount();
  const { errors } = useFormState();

  if (!isConnected) {
    return null;
  }

  return (
    <DelegationFormBalanceStyled $withError={!!errors['delegateAddress']}>
      <Balance>
        <Text>Your voting power</Text>
        <Text weight={700}>
          {loading.isDaoTokenBalanceLoading
            ? 'Loading...'
            : formatNumber({ value: daoTokenBalance })}{' '}
          {tokenData?.symbol}
        </Text>
      </Balance>
      {onCustomizeClick && (
        <CustomizeButton onClick={onCustomizeClick}>Customize</CustomizeButton>
      )}
    </DelegationFormBalanceStyled>
  );
};
