import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStageFail,
  TxStagePending,
  TxStagePermit,
  TxStageSuccess,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';

const getTxModalStagesScheduleProposal = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  confirmStage: () => transitStage(<TxStagePermit />),
  pendingStage: (proposalId: number) =>
    transitStage(
      <TxStagePending title={`You are scheduling proposal #${proposalId}`} />,
    ),
  successStage: ({
    txHash,
    proposalId,
  }: {
    txHash: string;
    proposalId: number;
  }) =>
    transitStage(
      <TxStageSuccess
        title="Success"
        description={`Proposal #${proposalId} was successfully scheduled`}
        txHash={txHash}
        showEtherscan
      />,
    ),
  failureStage: () => transitStage(<TxStageFail />),
});

export const useScheduleProposalTxModal = () => {
  return useTransactionModalStage(getTxModalStagesScheduleProposal);
};
