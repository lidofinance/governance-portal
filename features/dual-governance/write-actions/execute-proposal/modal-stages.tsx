import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import {
  TxStageFail,
  TxStagePending,
  TxStageSuccess,
  TxStageSign,
} from 'shared/blockchain/transaction-modal/tx-stages-basic';

const getTxModalStagesExecuteProposal = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signStage: (proposalId: number) =>
    transitStage(
      <TxStageSign
        title={`You are executing proposal #${proposalId}`}
        description=""
      />,
    ),
  pendingStage: ({
    txHash,
    proposalId,
  }: {
    txHash: string;
    proposalId: number;
  }) =>
    transitStage(
      <TxStagePending
        title={`You are executing proposal #${proposalId}`}
        txHash={txHash}
      />,
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
        description={`Proposal #${proposalId} was successfully executed`}
        txHash={txHash}
        showEtherscan
      />,
    ),
  failureStage: () => transitStage(<TxStageFail />),
});

export const useExecuteProposalTxModal = () => {
  return useTransactionModalStage(getTxModalStagesExecuteProposal);
};
