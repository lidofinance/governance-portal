import { useCallback } from 'react';

import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useVoteTxSender } from './tx-sender';
import { useTxModalVote } from './modal-stages';
import { VoteMode } from 'features/vote/types';
import { Address } from 'viem';
import { useVoteContext } from 'features/vote/providers/vote-context';

type VoteActionArgs = {
  mode: VoteMode;
  delegatedVoters?: Address[];
  requestDelegateSelection?: boolean;
};

export const useVoteAction = () => {
  const { data: isMultisig } = useIsContract();
  const { txModalStages } = useTxModalVote();
  const sendVoteTx = useVoteTxSender();
  const waitForTx = useTxConfirmation();

  const { eligibleDelegators, vote, refetchers } = useVoteContext();

  const processVote = useCallback(
    async ({
      requestDelegateSelection,
      mode,
      delegatedVoters,
    }: VoteActionArgs) => {
      if (requestDelegateSelection) {
        txModalStages.confirm({
          mode,
          eligibleDelegators,
          onSubmit: (selectedVoters) =>
            processVote({
              mode,
              delegatedVoters: selectedVoters,
            }),
        });
        return;
      }

      try {
        const voteId = BigInt(vote.id);

        txModalStages.sign({ delegatedVoters, voteId, mode });

        const txHash = await sendVoteTx({ delegatedVoters, voteId, mode });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending({ delegatedVoters, voteId, mode }, txHash);

        const response = await waitForTx(txHash);
        if (response.status === 'reverted') {
          throw new Error('Transaction was reverted');
        }

        const [, updatedVoteEvents, updatedVoterState, updatedDelegatorsData] =
          await Promise.all([
            refetchers.refetchVote(),
            refetchers.refetchVoteEvents(),
            refetchers.refetchVoterState(),
            refetchers.refetchDelegatorsData(),
          ]);

        txModalStages.success({
          mode,
          txHash,
          onVoteWithOwnTokens: (voteMode: VoteMode) =>
            processVote({ mode: voteMode }),
          onVoteWithRemainingDelegated: (
            selectedVoters: Address[],
            voteMode: VoteMode,
          ) =>
            processVote({
              delegatedVoters: selectedVoters,
              mode: voteMode,
            }),
          voteEvents: updatedVoteEvents.data ?? [],
          votePower: updatedVoterState.data?.voterDaoTokenBalance ?? 0n,
          remainingDelegators:
            updatedDelegatorsData.data?.eligibleDelegatedVoters ?? [],
          remainingDelegatedVotingPower:
            updatedDelegatorsData.data?.eligibleDelegatedVotingPower ?? 0n,
        });

        return true;
      } catch (error) {
        console.error('Error during vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
          () => processVote({ mode, delegatedVoters }),
        );

        return false;
      }
    },
    [
      vote.id,
      txModalStages,
      eligibleDelegators,
      isMultisig,
      refetchers,
      waitForTx,
      sendVoteTx,
    ],
  );

  return processVote;
};
