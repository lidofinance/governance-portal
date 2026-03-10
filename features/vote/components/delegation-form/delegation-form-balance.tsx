import { Text } from '@lidofinance/lido-ui';
import { useFormState } from 'react-hook-form';
import { Balance, CustomizeButton, DelegationFormBalanceStyled } from './style';
import { useAccount } from 'wagmi';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { formatToken } from 'shared/blockchain/utils';
import { KnownToken } from 'shared/blockchain/tokens';

type Props = {
  onCustomizeClick?: () => void;
};

export const DelegationFormBalance = ({ onCustomizeClick }: Props) => {
  const { daoTokenBalance } = useDelegationFormData();
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
          {typeof daoTokenBalance !== 'bigint'
            ? 'Loading...'
            : formatToken({
                amount: daoTokenBalance,
                decimals: KnownToken.LDO.decimals,
                symbol: KnownToken.LDO.symbol,
              })}
        </Text>
      </Balance>
      {onCustomizeClick && (
        <CustomizeButton onClick={onCustomizeClick}>Customize</CustomizeButton>
      )}
    </DelegationFormBalanceStyled>
  );
};
