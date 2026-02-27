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
import { Hex } from 'viem';

const getTxModalStagesEnactVote = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (voteId: bigint) =>
    transitStage(
      <TxStageSign title={`You are enacting vote #${voteId}`} description="" />,
    ),

  pending: (voteId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStagePending
        title={`You are enacting vote #${voteId}`}
        txHash={txHash}
      />,
    ),

  success: (voteId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title={`Vote #${voteId} enacted`}
        txHash={txHash}
        description=""
      />,
    ),
});

export const useTxModalEnactVote = () => {
  return useTransactionModalStage(getTxModalStagesEnactVote);
};
