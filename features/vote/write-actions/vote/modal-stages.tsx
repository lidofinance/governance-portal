import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';
import { VoteMode, voteModeDict } from '../../types';
import { VoteEvent, VotePhase } from 'shared/votes/types';
import { Address, Hex } from 'viem';
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

  signEnact: ({ voteId }: { voteId: string }) =>
    transitStage(
      <TxStageSign title={`You are enacting vote #${voteId}`} description="" />,
    ),

  pendingEnact: ({ voteId, txHash }: { voteId: string; txHash?: Hex }) =>
    transitStage(
      <TxStagePending
        title={`You are enacting vote #${voteId}`}
        txHash={txHash}
      />,
    ),

  pending: (mode: VoteMode, txHash?: Hex) =>
    transitStage(
      <TxStagePending title={getInProgressText(mode)} txHash={txHash} />,
    ),

  successEnact: ({ voteId, txHash }: { voteId: string; txHash?: Hex }) =>
    transitStage(
      <TxStageSuccess
        title={`Vote #${voteId} is enacted`}
        txHash={txHash}
        description=""
      />,
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
    voteId: bigint;
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
        voteId={voteId}
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
