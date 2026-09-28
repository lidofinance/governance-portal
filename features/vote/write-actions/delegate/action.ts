import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useTxModalDelegate } from './modal-stages';
import { useDelegateTxSender } from './tx-sender';
import { DelegationFormInput } from '@vote/types';

export const useDelegateAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalDelegate();
  const sendDelegateTx = useDelegateTxSender();
  const waitForTx = useTxConfirmation();

  const proceedWithDelegation = useCallback(
    async (args: DelegationFormInput) => {
      txModalStages.sign();

      const txHash = await sendDelegateTx(args);

      if (isMultisig) {
        txModalStages.successMultisig();
        return;
      }

      txModalStages.pending(txHash);

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        txModalStages.failed(
          new Error('Failed to delegate, please, try again.'),
          onRetry,
        );
      }
    },
    [txModalStages, isMultisig, sendDelegateTx, waitForTx, onRetry],
  );

  return useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      try {
        invariant(delegateAddress, 'Delegate address is required');

        await proceedWithDelegation({ delegateAddress });

        txModalStages.success();
        await onConfirm?.();

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [txModalStages, onConfirm, proceedWithDelegation, onRetry],
  );
};
