import { useAccount } from 'wagmi';
import { useSupportFormDataContext } from './support-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { useDappStatus } from 'shared/hooks';

export const SupportAmountInput = () => {
  const { isConnected } = useAccount();
  const { isDappActive } = useDappStatus();
  const { activeToken, maxAmount } = useSupportFormDataContext();

  return (
    <TokenAmountInputHookForm
      disabled={isConnected && !isDappActive}
      fieldName="amount"
      token={activeToken}
      data-testid="supportInput"
      maxValue={maxAmount}
    />
  );
};
