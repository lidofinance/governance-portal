import { DelegateButton } from './style';
import { useAccount } from 'wagmi';
import { useConnect } from 'reef-knot/core-react';
import { useFormState } from 'react-hook-form';

export const DelegationFormSubmitButton = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { isValidating, isSubmitting } = useFormState();

  if (!isConnected) {
    return (
      <DelegateButton onClick={connect} type="button">
        Connect wallet
      </DelegateButton>
    );
  }

  return (
    <DelegateButton loading={isValidating || isSubmitting} type="submit">
      Delegate on Aragon & Snapshot
    </DelegateButton>
  );
};
