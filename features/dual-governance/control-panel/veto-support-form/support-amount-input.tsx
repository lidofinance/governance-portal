import { useAccount } from 'wagmi';
import { useSupportFormDataContext } from './support-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { useDappStatus } from 'shared/hooks';

export const SupportAmountInput = () => {
  const { isConnected } = useAccount();
  const { isDappActive } = useDappStatus();
  const { selectedToken, maxAmount } = useSupportFormDataContext();

  return (
    <TokenAmountInputHookForm
      disabled={isConnected && !isDappActive}
      fieldName="amount"
      token={selectedToken}
      data-testid="vetoSupportInput"
      maxValue={maxAmount}
    />
  );
};
