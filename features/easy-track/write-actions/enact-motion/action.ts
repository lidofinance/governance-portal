import { useCallback } from 'react';
import { Hex } from 'viem';
import { useQueryClient } from '@tanstack/react-query';

import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useLidoSDK } from 'providers/lido-sdk';

import { useTxModalEnactMotion } from './modal-stages';
import { useEnactMotionTxSender } from './tx-sender';

export const useEnactMotionAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalEnactMotion();
  const sendEnactMotionTx = useEnactMotionTxSender();
  const waitForTx = useTxConfirmation();
  const queryClient = useQueryClient();
  const { chainId } = useLidoSDK();

  return useCallback(
    async (motionId: bigint, calldata: Hex) => {
      try {
        txModalStages.sign(motionId);

        const txHash = await sendEnactMotionTx(motionId, calldata);

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
      sendEnactMotionTx,
      waitForTx,
      queryClient,
      chainId,
    ],
  );
};
