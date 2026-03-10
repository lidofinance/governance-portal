import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';

import { useTxModalObjectMotion } from './modal-stages';
import { useObjectMotionTxSender } from './tx-sender';

export const useObjectMotionAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalObjectMotion();
  const sendObjectMotionTx = useObjectMotionTxSender();
  const waitForTx = useTxConfirmation();
  const queryClient = useQueryClient();
  const { chainId } = useLidoSDK();

  return useCallback(
    async (motionId: bigint) => {
      try {
        txModalStages.sign(motionId);

        const txHash = await sendObjectMotionTx(motionId);

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
        await queryClient.invalidateQueries({
          queryKey: ['motion-is-objected-by'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['motion-can-object-by'],
        });

        txModalStages.success(motionId, txHash);
      } catch (error) {
        txModalStages.failed(error);
      }
    },
    [
      isMultisig,
      txModalStages,
      sendObjectMotionTx,
      waitForTx,
      queryClient,
      chainId,
    ],
  );
};
