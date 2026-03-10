import { useCallback } from 'react';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useTxModalMotion } from '../write-actions/motion/modal-stages';
import { useMotionTxSender } from '../write-actions/motion/tx-sender';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';

const useRunMotionTx = () => {
  const { txModalStages } = useTxModalMotion();
  const waitForTx = useTxConfirmation();
  const { isConnected } = useAccount();
  const { data: isMultisig } = useIsContract();
  const queryClient = useQueryClient();
  const { chainId } = useLidoSDK();

  return useCallback(
    async (opts: {
      sign: () => void;
      send: () => Promise<Hex>;
      pending: (txHash: Hex) => void;
      success: (txHash: Hex) => void;
      extraInvalidations?: () => Promise<void>;
    }): Promise<void> => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet'));
        return;
      }

      try {
        opts.sign();

        const txHash = await opts.send();

        if (isMultisig) {
          txModalStages.successMultisig();
          return;
        }

        opts.pending(txHash);

        const receipt = await waitForTx(txHash);

        if (receipt.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: ['active-motions', chainId],
        });

        await opts.extraInvalidations?.();

        opts.success(txHash);
      } catch (error) {
        txModalStages.failed(error);
      }
    },
    [isConnected, isMultisig, txModalStages, waitForTx, queryClient, chainId],
  );
};

export const useMotionActions = () => {
  const { txModalStages } = useTxModalMotion();
  const { objectMotionTxSender, enactMotionTxSender, cancelMotionTxSender } =
    useMotionTxSender();
  const queryClient = useQueryClient();
  const runMotionTx = useRunMotionTx();

  const handleObject = useCallback(
    async (motionId: bigint) => {
      await runMotionTx({
        sign: () => txModalStages.signObject(motionId),
        send: () => objectMotionTxSender(motionId),
        pending: (txHash: Hex) => txModalStages.pendingObject(motionId, txHash),
        success: (txHash: Hex) => txModalStages.successObject(motionId, txHash),
        extraInvalidations: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['motion-is-objected-by'],
          });
          await queryClient.invalidateQueries({
            queryKey: ['motion-can-object-by'],
          });
        },
      });
    },
    [runMotionTx, txModalStages, objectMotionTxSender, queryClient],
  );

  const handleEnact = useCallback(
    async (motionId: bigint, calldata: Hex) => {
      await runMotionTx({
        sign: () => txModalStages.signEnact(motionId),
        send: () => enactMotionTxSender(motionId, calldata),
        pending: (txHash: Hex) => txModalStages.pendingEnact(motionId, txHash),
        success: (txHash: Hex) => txModalStages.successEnact(motionId, txHash),
      });
    },
    [runMotionTx, txModalStages, enactMotionTxSender],
  );

  const handleCancel = useCallback(
    async (motionId: bigint) => {
      await runMotionTx({
        sign: () => txModalStages.signCancel(motionId),
        send: () => cancelMotionTxSender(motionId),
        pending: (txHash: Hex) => txModalStages.pendingCancel(motionId, txHash),
        success: (txHash: Hex) => txModalStages.successCancel(motionId, txHash),
      });
    },
    [runMotionTx, txModalStages, cancelMotionTxSender],
  );

  return { handleObject, handleEnact, handleCancel };
};
