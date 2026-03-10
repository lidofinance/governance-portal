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

const getTxModalStagesEnactMotion = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (motionId: bigint) =>
    transitStage(
      <TxStageSign title={`Enacting motion #${motionId}`} description="" />,
    ),

  pending: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStagePending title={`Enacting motion #${motionId}`} txHash={txHash} />,
    ),

  success: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title={`Motion #${motionId} enacted`}
        txHash={txHash}
        description=""
      />,
      { isClosableOnLedger: true },
    ),
});

export const useTxModalEnactMotion = () =>
  useTransactionModalStage(getTxModalStagesEnactMotion);
