import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useTxModalRevokeDelegation } from './modal-stages';
import { useRevokeDelegationTxSender } from './tx-sender';
import { DelegationType } from 'features/vote/types';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';

export const useRevokeDelegationAction = ({
  onConfirm,
  onRetry,
}: ActionArgs) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalRevokeDelegation();
  const sendRevokeDelegationTx = useRevokeDelegationTxSender();
  const waitForTx = useTxConfirmation();
  const { confirm } = useConfirmModal();

  return useCallback(
    async (type: DelegationType) => {
      try {
        const hasApprove = await confirm({
          title: `Revoke ${type} delegation?`,
          confirmText: 'Revoke',
          cancelText: 'Cancel',
        });

        if (!hasApprove) {
          return false;
        }

        txModalStages.sign(type);

        const txHash = await sendRevokeDelegationTx(type);

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(type, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(
            new Error(
              `Failed to revoke delegation on ${type}, please, try again.`,
            ),
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
    [
      txModalStages,
      isMultisig,
      sendRevokeDelegationTx,
      waitForTx,
      onConfirm,
      onRetry,
      confirm,
    ],
  );
};
