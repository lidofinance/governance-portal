import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useEnactVoteTxSender } from './tx-sender';
import { useTxModalEnactVote } from './modal-stages';

type Args = {
  voteId: bigint;
} & ActionArgs;

export const useEnactVoteAction = ({ voteId, onConfirm, onRetry }: Args) => {
  const { isConnected } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalEnactVote();
  const sendEnactTx = useEnactVoteTxSender();
  const waitForTx = useTxConfirmation();

  return useCallback(async () => {
    if (!isConnected) {
      txModalStages.failed(new Error('Please connect your wallet to enact'));
      return;
    }

    try {
      txModalStages.sign(voteId);

      const txHash = await sendEnactTx(voteId);

      if (isMultisig) {
        txModalStages.successMultisig();
        return true;
      }

      txModalStages.pending(voteId, txHash);

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        txModalStages.failed(new Error('Transaction was reverted'), onRetry);
        return;
      }

      await onConfirm();
      txModalStages.success(voteId, txHash);
      return true;
    } catch (error) {
      console.error('Error during vote:', error);
      txModalStages.failed(
        error instanceof Error ? error : new Error('Unknown error occurred'),
      );

      return false;
    }
  }, [
    voteId,
    isConnected,
    isMultisig,
    txModalStages,
    waitForTx,
    onConfirm,
    onRetry,
    sendEnactTx,
  ]);
};
