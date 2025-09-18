import { MouseEventHandler, useMemo, useRef } from 'react';
import { DelegateButton, HiddenButton } from './style';
import { useAccount } from 'wagmi';
import { useDelegationFormData } from 'features/vote/providers/delegation-form-context';
import { useConnect } from 'reef-knot/core-react';

type Props = {
  onCustomizeClick?: () => void;
};

const onSubmitDialog: MouseEventHandler<HTMLButtonElement> = (event) => {
  // this prevents form being submitted by Enter keypress on the input
  event.preventDefault();
  // openConfirmReDelegateModal();
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DelegationFormSubmitButton = ({ onCustomizeClick }: Props) => {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { mode, aragonDelegateAddress, snapshotDelegateAddress, watch } =
    useDelegationFormData();
  const ref = useRef<HTMLButtonElement>(null);

  // const submitFromModal = useCallback(() => {
  //   ref.current?.click();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ref]);

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
    if (!isConnected) {
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
      mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress;

    if (delegateAddress) {
      return 'Redelegate';
    }
    return 'Delegate';
  }, [
    isConnected,
    isSimple,
    mode,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    match,
  ]);

  // const subtitle = useMemo(() => {
  //   const start = `
  //     ${match.isRedelegateAragon ? 'Aragon' : ''}
  //     ${match.isRedelegateAragon && match.isRedelegateSnapshot ? ' & ' : ''}
  //     ${match.isRedelegateSnapshot ? 'Snapshot' : ''}
  //   `.trim();
  //   const end = `
  //     ${match.isRedelegateAragon && match.isRedelegateSnapshot ? 'one' : 'on '}
  //     ${!match.isRedelegateAragon ? 'Aragon' : ''}
  //     ${!match.isRedelegateAragon && !match.isRedelegateSnapshot ? ' & ' : ''}
  //     ${!match.isRedelegateSnapshot ? 'Snapshot' : ''}
  //   `.trim();
  //   return (
  //     <>

  //       <Text
  //         size="xs"
  //         color="secondary"
  //       >{`You are about to redelegate on ${start}.`}</Text>
  //       <Text
  //         size="xs"
  //         color="secondary"
  //       >{`To change only ${end}, use Customize`}</Text>
  //     </>
  //   );
  // }, [match]);

  // const { openModal: openConfirmReDelegateModal } = useConfirmReDelegateModal({
  //   onAlternative: onCustomizeClick,
  //   onSubmit: submitFromModal,
  //   subtitle,
  // });

  if (!isConnected) {
    return (
      <DelegateButton onClick={connect} type="button">
        Connect wallet
      </DelegateButton>
    );
  }

  if (!match.isRedelegate || !isSimple) {
    return <DelegateButton type="submit">{buttonText}</DelegateButton>;
  }

  return (
    <>
      <DelegateButton type="submit" onClick={onSubmitDialog}>
        {buttonText}
      </DelegateButton>
      <HiddenButton ref={ref} type="submit" />
    </>
  );
};
