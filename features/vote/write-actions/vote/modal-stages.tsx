import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStagePending,
  TxStageSign,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { VoteMode, voteModeDict } from '../../types';
import { VoteEvent, VotePhase } from 'shared/votes/types';
import { Address } from 'viem';
import { VoteSuccessModal } from '../../components/vote-actions/modals/vote-success-modal/vote-success-modal';
import { VoteConfirmDelegatedModal } from '../../components/vote-actions/modals/vote-delegated-confirm-modal';

const getInProgressText = (mode: VoteMode) => {
  return `You are voting "${voteModeDict[mode]}"`;
};

const getTxModalStagesVote = (transitStage: TransactionModalTransitStage) => ({
  ...getGeneralTransactionModalStages(transitStage),

  confirm: ({
    mode,
    voteId,
    onSubmit,
  }: {
    mode: VoteMode;
    voteId: bigint;
    onSubmit: (selectedDelegatorsAddresses: Address[]) => void;
  }) =>
    transitStage(
      <VoteConfirmDelegatedModal
        mode={mode}
        voteId={voteId}
        onSubmit={onSubmit}
      />,
    ),

  sign: ({ mode }: { mode: VoteMode }) =>
    transitStage(
      <TxStageSign title={getInProgressText(mode)} description="" />,
    ),

  pending: (mode: VoteMode, txHash?: string) =>
    transitStage(
      <TxStagePending title={getInProgressText(mode)} txHash={txHash} />,
    ),

  success: ({
    mode,
    txHash,
    onVoteWithOwnTokens,
    onVoteWithRemainingDelegated,
    voteEvents,
    votePhase,
    votePower,
    voteId,
    title,
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
    voteId: bigint;
    title: string;
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
        voteId={voteId}
        title={title}
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
