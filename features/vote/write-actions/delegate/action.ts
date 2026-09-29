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

  return useCallback(
    async ({ delegateAddress }: DelegationFormInput) => {
      try {
        invariant(delegateAddress, 'Delegate address is required');

        txModalStages.sign();

        const txHash = await sendDelegateTx({ delegateAddress });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(
            new Error('Failed to delegate, please, try again.'),
            onRetry,
          );
          return false;
        }

        txModalStages.success();
        await onConfirm?.();

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [txModalStages, isMultisig, sendDelegateTx, waitForTx, onConfirm, onRetry],
  );
};
