import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useTxModalRevokeDelegation } from './modal-stages';
import { useRevokeDelegationTxSender } from './tx-sender';
import { DelegationType } from '@vote/types';
import { useConfirmModal } from 'shared/hooks/use-confirm-modal';

export const useRevokeDelegationAction = ({ onConfirm }: ActionArgs) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalRevokeDelegation();
  const sendRevokeDelegationTx = useRevokeDelegationTxSender();
  const waitForTx = useTxConfirmation();
  const { confirm } = useConfirmModal();

  const revoke = useCallback(
    async (type: DelegationType): Promise<boolean> => {
      // Retry re-sends the same revoke; the form's retry event would submit a delegation
      const onRetry = () => void revoke(type);

      try {
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
              type === 'Aragon'
                ? 'Failed to revoke delegation, please, try again.'
                : `Failed to revoke delegation on ${type}, please, try again.`,
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
    [txModalStages, isMultisig, sendRevokeDelegationTx, waitForTx, onConfirm],
  );

  return useCallback(
    async (type: DelegationType) => {
      const hasApprove = await confirm({
        title:
          type === 'Aragon'
            ? 'Revoke delegation?'
            : `Revoke ${type} delegation?`,
        confirmText: 'Revoke',
        cancelText: 'Cancel',
      });

      if (!hasApprove) {
        return false;
      }

      return revoke(type);
    },
    [confirm, revoke],
  );
};
