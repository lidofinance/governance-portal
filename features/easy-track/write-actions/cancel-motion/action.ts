import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';

import { useTxModalCancelMotion } from './modal-stages';
import { useCancelMotionTxSender } from './tx-sender';

export const useCancelMotionAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalCancelMotion();
  const sendCancelMotionTx = useCancelMotionTxSender();
  const waitForTx = useTxConfirmation();
  const queryClient = useQueryClient();
  const { chainId } = useLidoSDK();

  return useCallback(
    async (motionId: bigint) => {
      try {
        txModalStages.sign(motionId);

        const txHash = await sendCancelMotionTx(motionId);

        if (isMultisig) {
          txModalStages.successMultisig();
          return;
        }

        txModalStages.pending(motionId, txHash);

        const receipt = await waitForTx(txHash);

        if (receipt.status === 'reverted') {
          throw new Error('Transaction was reverted');
        }

        await queryClient.invalidateQueries({
          queryKey: ['active-motions', chainId],
        });

        txModalStages.success(motionId, txHash);
      } catch (error) {
        txModalStages.failed(error);
      }
    },
    [
      isMultisig,
      txModalStages,
      sendCancelMotionTx,
      waitForTx,
      queryClient,
      chainId,
    ],
  );
};
