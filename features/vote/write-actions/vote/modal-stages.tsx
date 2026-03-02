import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStagePending,
  TxStageSign,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { VoteMode } from 'features/vote/types';
import { VoteEvent, VotePhase } from 'shared/votes/types';
import { Address, Hex } from 'viem';
import { VoteSuccessModal } from '../../components/vote-actions/modals/vote-success-modal/vote-success-modal';
import { VoteConfirmDelegatedModal } from '../../components/vote-actions/modals/vote-delegated-confirm-modal';
import { VoteTxArgs } from './types';
import { VOTE_MODE_MAP } from 'features/vote/constants';
import { ComponentProps } from 'react';

const getInProgressText = ({ delegatedVoters, mode }: VoteTxArgs) => {
  if (delegatedVoters?.length) {
    return `You are voting '${VOTE_MODE_MAP[mode]}' on behalf of ${delegatedVoters.length} delegator${delegatedVoters.length > 1 ? 's' : ''}`;
  }
  return `You are voting '${VOTE_MODE_MAP[mode]}'`;
};

const getTxModalStagesVote = (transitStage: TransactionModalTransitStage) => ({
  ...getGeneralTransactionModalStages(transitStage),

  confirm: (props: ComponentProps<typeof VoteConfirmDelegatedModal>) =>
    transitStage(<VoteConfirmDelegatedModal {...props} />),

  sign: (args: VoteTxArgs) =>
    transitStage(
      <TxStageSign title={getInProgressText(args)} description="" />,
    ),

  pending: (args: VoteTxArgs, txHash?: Hex) =>
    transitStage(
      <TxStagePending title={getInProgressText(args)} txHash={txHash} />,
    ),

  success: ({
    mode,
    txHash,
    onVoteWithOwnTokens,
    onVoteWithRemainingDelegated,
    voteEvents,
    votePhase,
    votePower,
    title,
    justVotedDelegators,
  }: {
    mode: VoteMode;
    txHash: string | undefined;
    onVoteWithOwnTokens: (mode: VoteMode) => void;
    onVoteWithRemainingDelegated?: (
      selectedVoters: Address[],
      mode: VoteMode,
    ) => void;
    voteEvents?: VoteEvent[];
    votePhase?: VotePhase;
    votePower?: bigint;
    title: string;
    justVotedDelegators?: Address[];
  }) => {
    return transitStage(
      <VoteSuccessModal
        mode={mode}
        txHash={txHash}
        onVoteWithOwnTokens={onVoteWithOwnTokens}
        onVoteWithRemainingDelegated={onVoteWithRemainingDelegated}
        voteEvents={voteEvents}
        votePhase={votePhase}
        votePower={votePower}
        title={title}
        justVotedDelegators={justVotedDelegators}
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalVote = () => {
  return useTransactionModalStage(getTxModalStagesVote);
};
