import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useTxModalDelegate } from './modal-stages';
import { useDelegateTxSender } from './tx-sender';
import { DelegationFormInput, DelegationFormMode } from 'features/vote/types';
import { DelegateTxArgs } from './types';

type Args = {
  mode: DelegationFormMode;
} & ActionArgs;

export const useDelegateAction = ({ mode, onConfirm, onRetry }: Args) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalDelegate();
  const sendDelegateTx = useDelegateTxSender();
  const waitForTx = useTxConfirmation();

  const proceedWithDelegation = useCallback(
    async (args: DelegateTxArgs) => {
      txModalStages.sign(args);

      const txHash = await sendDelegateTx(args);

      if (isMultisig) {
        txModalStages.successMultisig();
        return;
      }

      txModalStages.pending(args, txHash);

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        txModalStages.failed(
          new Error(`Failed to delegate on ${args.type}, please, try again.`),
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

        if (mode === 'simple') {
          await proceedWithDelegation({ delegateAddress, type: 'Aragon' });
          await proceedWithDelegation({ delegateAddress, type: 'Snapshot' });
        } else {
          await proceedWithDelegation({ delegateAddress, type: mode });
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
    [mode, txModalStages, onConfirm, proceedWithDelegation, onRetry],
  );
};
