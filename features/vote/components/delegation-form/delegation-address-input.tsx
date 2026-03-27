import { useAccount } from 'wagmi';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { InputHookForm } from 'shared/hook-form/input-hook-form';

export const DelegationAddressInput = () => {
  const { isConnected } = useAccount();
  const { loading } = useDelegationFormData();

  return (
    <InputHookForm
      fieldName="delegateAddress"
      label="Delegate address"
      disabled={!isConnected || loading.isDelegationInfoLoading}
      autoComplete="new-password"
      data-1p-ignore // disables 1password element
    />
  );
};
