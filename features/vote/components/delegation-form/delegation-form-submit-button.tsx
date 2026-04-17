import { MouseEventHandler, useCallback, useMemo } from 'react';
import { useConnect } from 'reef-knot/core-react';
import { Text } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useFormContext } from 'react-hook-form';
import { useFormControllerContext } from 'shared/hook-form/form-controller-context';
import { useDelegationFormData } from '@vote/providers/delegation-form-context';
import { DelegateButton } from './style';
import { useConfirmReDelegateModal } from './confirm-re-delegate-modal';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';

type Props = {
  onCustomizeClick?: () => void;
};

export const DelegationFormSubmitButton = ({ onCustomizeClick }: Props) => {
  const { isConnected: isWalletConnected } = useAccount();
  const isSupportedChain = useIsSupportedChain();
  const { connect } = useConnect();
  const { mode, aragonDelegateAddress, snapshotDelegateAddress, watch } =
    useDelegationFormData();
  const {
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useFormContext();
  const { onSubmit, onReset } = useFormControllerContext();

  const submitFromModal = useCallback(() => {
    void handleSubmit(async (data) => {
      const success = await onSubmit(data);
      if (success) {
        onReset ? onReset(data) : reset();
      }
    })();
  }, [handleSubmit, onSubmit, onReset, reset]);

  const isSimple = mode === 'simple';
  const [delegateAddressInput] = watch(['delegateAddress']);

  const match = useMemo(() => {
    const isInputMatchAragon = Boolean(
      delegateAddressInput &&
        `${delegateAddressInput}`.toLowerCase() ===
          `${aragonDelegateAddress}`.toLowerCase(),
    );
    const isInputMatchSnapshot = Boolean(
      delegateAddressInput &&
        `${delegateAddressInput}`.toLowerCase() ===
          `${snapshotDelegateAddress}`.toLowerCase(),
    );
    const isRedelegateAragon = aragonDelegateAddress && !isInputMatchAragon;
    const isRedelegateSnapshot =
      snapshotDelegateAddress && !isInputMatchSnapshot;

    const isRedelegate = isRedelegateAragon || isRedelegateSnapshot;
    return {
      isInputMatchAragon,
      isInputMatchSnapshot,
      isRedelegate,
      isRedelegateAragon,
      isRedelegateSnapshot,
    };
  }, [aragonDelegateAddress, delegateAddressInput, snapshotDelegateAddress]);

  const buttonText = useMemo(() => {
    if (!isWalletConnected) {
      return null;
    }

    if (isSimple) {
      return `
      ${match.isRedelegate ? 'Redelegate' : 'Delegate'}
      ${!match.isInputMatchAragon || !match.isInputMatchSnapshot ? ' on ' : ''}
      ${match.isInputMatchAragon ? '' : 'Aragon'}
      ${!match.isInputMatchAragon && !match.isInputMatchSnapshot ? ' & ' : ''}
      ${match.isInputMatchSnapshot ? '' : 'Snapshot'}`;
    }

    const delegateAddress =
      mode === 'Aragon' ? aragonDelegateAddress : snapshotDelegateAddress;

    if (delegateAddress) {
      return 'Redelegate';
    }
    return 'Delegate';
  }, [
    isWalletConnected,
    isSimple,
    mode,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    match,
  ]);

  const subtitle = useMemo(() => {
    const start = `
      ${match.isRedelegateAragon ? 'Aragon' : ''}
      ${match.isRedelegateAragon && match.isRedelegateSnapshot ? ' & ' : ''}
      ${match.isRedelegateSnapshot ? 'Snapshot' : ''}
    `.trim();
    const end = `
      ${match.isRedelegateAragon && match.isRedelegateSnapshot ? 'one' : 'on '}
      ${!match.isRedelegateAragon ? 'Aragon' : ''}
      ${!match.isRedelegateAragon && !match.isRedelegateSnapshot ? ' & ' : ''}
      ${!match.isRedelegateSnapshot ? 'Snapshot' : ''}
    `.trim();
    return (
      <>
        <Text
          size="xs"
          color="secondary"
        >{`You are about to redelegate on ${start}.`}</Text>
        <Text
          size="xs"
          color="secondary"
        >{`To change only ${end}, use Customize`}</Text>
      </>
    );
  }, [match]);

  const { openModal: openConfirmReDelegateModal } = useConfirmReDelegateModal();

  const onSubmitDialog: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    openConfirmReDelegateModal({
      onAlternative: onCustomizeClick,
      onSubmit: submitFromModal,
      subtitle,
    });
  };

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

  if (!match.isRedelegate || !isSimple) {
    return (
      <DelegateButton
        type="submit"
        disabled={!isSupportedChain}
        loading={isSubmitting}
        data-testid="delegateButton"
      >
        {buttonText}
      </DelegateButton>
    );
  }

  return (
    <DelegateButton
      type="submit"
      loading={isSubmitting}
      disabled={!isSupportedChain}
      onClick={onSubmitDialog}
      data-testid="redelegateButton"
    >
      {buttonText}
    </DelegateButton>
  );
};
