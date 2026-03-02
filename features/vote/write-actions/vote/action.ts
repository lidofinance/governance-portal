import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { ActionArgs } from 'shared/types';
import { useVoteTxSender } from './tx-sender';
import { useTxModalVote } from './modal-stages';
import { VoteTxArgs } from './types';
import { VoteMode } from 'features/vote/types';
import { Address } from 'viem';
import { useVoteContext } from 'features/vote/providers/vote-context';
import invariant from 'tiny-invariant';

type VoteActionArgs = {
  mode: VoteMode;
  delegatedVoters?: Address[];
  requestDelegateSelection?: boolean;
};

export const useVoteAction = ({ onConfirm, onRetry }: ActionArgs) => {
  const { isConnected } = useAccount();
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalVote();
  const sendVoteTx = useVoteTxSender();
  const waitForTx = useTxConfirmation();

  const { eligibleDelegators, vote, voteEvents } = useVoteContext();

  const proceedWithVote = useCallback(
    async ({ voteId, delegatedVoters, mode }: VoteTxArgs) => {
      try {
        txModalStages.sign({ delegatedVoters, voteId, mode });

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
          onRetry,
        );

        return false;
      }
    },
    [txModalStages, sendVoteTx, isMultisig, waitForTx, onConfirm, onRetry],
  );

  return useCallback(
    async ({
      requestDelegateSelection,
      mode,
      delegatedVoters,
    }: VoteActionArgs) => {
      const voteId = BigInt(vote.id);
      invariant(voteId, 'Vote ID is required to proceed with voting');
      invariant(isConnected, 'Wallet must be connected to proceed with voting');

      if (requestDelegateSelection) {
        txModalStages.confirm({
          mode,
          voteEvents,
          eligibleDelegators,
          onSubmit: async (selectedVoters) => {
            await proceedWithVote({
              voteId,
              mode,
              delegatedVoters: selectedVoters,
            });
          },
        });
      } else {
        await proceedWithVote({ voteId, mode, delegatedVoters });
      }
    },
    [
      vote.id,
      isConnected,
      txModalStages,
      voteEvents,
      eligibleDelegators,
      proceedWithVote,
    ],
  );
};
