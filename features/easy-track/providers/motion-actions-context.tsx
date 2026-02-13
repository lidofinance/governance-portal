import { createContext, FC, useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';
import { Hex } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useTxModalMotion } from '../write-actions/motion/modal-stages';
import { useMotionTxSender } from '../write-actions/motion/tx-sender';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useLidoSDK } from 'providers/lido-sdk';

type Value = {
  handleObject: (motionId: bigint) => Promise<void>;
  handleEnact: (motionId: bigint, calldata: Hex) => Promise<void>;
};

const MotionActionsContext = createContext<Value | null>(null);

export const useMotionActionsContext = () => {
  const value = useContext(MotionActionsContext);
  invariant(
    value,
    'useMotionActionsContext was used outside of MotionActionsProvider',
  );
  return value;
};

export const MotionActionsProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { txModalStages } = useTxModalMotion();
  const { objectMotionTxSender, enactMotionTxSender } = useMotionTxSender();
  const waitForTx = useTxConfirmation();
  const { isConnected } = useAccount();
  const { data: isMultisig } = useIsContract();
  const queryClient = useQueryClient();
  const { chainId } = useLidoSDK();

  const handleObject = useCallback(
    async (motionId: bigint) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet'));
        return;
      }

      try {
        txModalStages.signObject(motionId);

        const txHash = await objectMotionTxSender(motionId);

        if (isMultisig) {
          txModalStages.successMultisig();
          return;
        }

        txModalStages.pendingObject(motionId, txHash);

        const receipt = await waitForTx(txHash);

        if (receipt.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: ['active-motions', chainId],
        });
        await queryClient.invalidateQueries({ queryKey: ['isObjected'] });
        await queryClient.invalidateQueries({ queryKey: ['canObject'] });

        txModalStages.successObject(motionId, txHash);
      } catch (error) {
        console.error('Error objecting to motion:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error'),
        );
      }
    },
    [
      isConnected,
      isMultisig,
      objectMotionTxSender,
      txModalStages,
      waitForTx,
      queryClient,
      chainId,
    ],
  );

  const handleEnact = useCallback(
    async (motionId: bigint, calldata: Hex) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet'));
        return;
      }

      try {
        txModalStages.signEnact(motionId);

        const txHash = await enactMotionTxSender(motionId, calldata);

        if (isMultisig) {
          txModalStages.successMultisig();
          return;
        }

        txModalStages.pendingEnact(motionId, txHash);

        const receipt = await waitForTx(txHash);

        if (receipt.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: ['active-motions', chainId],
        });

        txModalStages.successEnact(motionId, txHash);
      } catch (error) {
        console.error('Error enacting motion:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error'),
        );
      }
    },
    [
      isConnected,
      isMultisig,
      enactMotionTxSender,
      txModalStages,
      waitForTx,
      queryClient,
      chainId,
    ],
  );

  return (
    <MotionActionsContext.Provider value={{ handleObject, handleEnact }}>
      {children}
    </MotionActionsContext.Provider>
  );
};
