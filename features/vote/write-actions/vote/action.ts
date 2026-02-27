import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useVoteTxSender } from './tx-sender';
import { useTxModalVote } from './modal-stages';
import { VoteTxArgs } from './types';

type Args = {
  voteId: bigint;
} & ActionArgs;

type TxArgs = Omit<VoteTxArgs, 'voteId'>;

type VoteActionArgs = {
  shouldSkipConfirmation?: boolean;
} & TxArgs;

export const useVoteAction = ({ voteId, onConfirm, onRetry }: Args) => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalVote();
  const sendVoteTx = useVoteTxSender();
  const waitForTx = useTxConfirmation();

  const proceedWithVote = useCallback(
    async ({ delegatedVoters, mode }: TxArgs) => {
      try {
        const txHash = await sendVoteTx({ delegatedVoters, voteId, mode });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending({ delegatedVoters, voteId, mode }, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'), onRetry);
          return;
        }
        await onConfirm();

        // TODO: add success call
        // txModalStages.success({
        //   mode,
        //   txHash,
        //   onVoteWithOwnTokens: onOwnVoteSubmit,
        //   onVoteWithRemainingDelegated: (
        //     selectedVoters: Address[],
        //     voteMode: VoteMode,
        //   ) => onDelegateVoteSubmit(voteMode, selectedVoters),
        //   voteEvents: updatedVoteEvents,
        //   votePhase: updatedVote.phase,
        //   votePower: updatedVote.votingPower,
        //   voteId: BigInt(voteId),
        //   title: `You voted "${voteModeDict[mode]}"`,
        // });

        return true;
      } catch (error) {
        console.error('Error during vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
        );

        return false;
      }
    },
    [
      voteId,
      isMultisig,
      txModalStages,
      waitForTx,
      onConfirm,
      onRetry,
      sendVoteTx,
    ],
  );

  return useCallback(
    async ({
      shouldSkipConfirmation,
      mode,
      delegatedVoters,
    }: VoteActionArgs) => {
      if (!shouldSkipConfirmation) {
        txModalStages.confirm({
          mode,
          onSubmit: async (selectedVoters) => {
            await proceedWithVote({
              mode,
              delegatedVoters: selectedVoters,
            });
          },
        });
      } else {
        await proceedWithVote({ mode, delegatedVoters });
      }
    },
    [txModalStages, proceedWithVote],
  );
};
