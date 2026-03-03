import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useEnactVoteTxSender } from './tx-sender';
import { useTxModalEnactVote } from './modal-stages';
import { useVoteContext } from 'features/vote/providers/vote-context';

export const useEnactVoteAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalEnactVote();
  const sendEnactTx = useEnactVoteTxSender();
  const waitForTx = useTxConfirmation();
  const { vote, refetchers } = useVoteContext();

  const enactVote = useCallback(async () => {
    try {
      const voteIdBigInt = BigInt(vote.id);
      txModalStages.sign(voteIdBigInt);

      const txHash = await sendEnactTx(voteIdBigInt);

      if (isMultisig) {
        txModalStages.successMultisig();
        return true;
      }

      txModalStages.pending(voteIdBigInt, txHash);

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        throw new Error('Transaction was reverted');
      }

      await refetchers.refetchVote();
      txModalStages.success(voteIdBigInt, txHash);
      return true;
    } catch (error) {
      console.error('Error during vote enact:', error);
      txModalStages.failed(
        error instanceof Error ? error : new Error('Unknown error occurred'),
        () => enactVote(),
      );

      return false;
    }
  }, [vote.id, txModalStages, isMultisig, refetchers, waitForTx, sendEnactTx]);

  return enactVote;
};
