import { useConnect } from 'reef-knot/core-react';
import { useAccount } from 'wagmi';
import { useFormContext } from 'react-hook-form';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { DelegateButton } from './style';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';

export const DelegationFormSubmitButton = () => {
  const { isConnected: isWalletConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { connect } = useConnect();
  const { aragonDelegateAddress } = useDelegationFormData();
  const {
    formState: { isSubmitting },
  } = useFormContext();

  if (!isWalletConnected) {
    return (
      <DelegateButton
        onClick={connect}
        type="button"
        data-testid="connectWalletButton"
      >
        Connect wallet
      </DelegateButton>
    );
  }

  return (
    <DelegateButton
      type="submit"
      disabled={!isSupportedChain}
      loading={isSubmitting}
      data-testid="delegateButton"
    >
      {aragonDelegateAddress ? 'Redelegate' : 'Delegate'}
    </DelegateButton>
  );
};
