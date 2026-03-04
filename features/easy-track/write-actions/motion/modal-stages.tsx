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

const getTxModalStagesMotion = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signObject: (motionId: bigint) =>
    transitStage(
      <TxStageSign title={`Objecting to motion #${motionId}`} description="" />,
    ),

  pendingObject: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStagePending
        title={`Objecting to motion #${motionId}`}
        txHash={txHash}
      />,
    ),

  successObject: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title={`Objection to motion #${motionId} submitted`}
        txHash={txHash}
        description=""
      />,
      { isClosableOnLedger: true },
    ),

  signEnact: (motionId: bigint) =>
    transitStage(
      <TxStageSign title={`Enacting motion #${motionId}`} description="" />,
    ),

  pendingEnact: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStagePending title={`Enacting motion #${motionId}`} txHash={txHash} />,
    ),

  successEnact: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title={`Motion #${motionId} enacted`}
        txHash={txHash}
        description=""
      />,
      { isClosableOnLedger: true },
    ),

  signCancel: (motionId: bigint) =>
    transitStage(
      <TxStageSign title={`Cancelling motion #${motionId}`} description="" />,
    ),

  pendingCancel: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStagePending
        title={`Cancelling motion #${motionId}`}
        txHash={txHash}
      />,
    ),

  successCancel: (motionId: bigint, txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title={`Motion #${motionId} cancelled`}
        txHash={txHash}
        description=""
      />,
      { isClosableOnLedger: true },
    ),

  signSubmit: () =>
    transitStage(<TxStageSign title="Creating motion" description="" />),

  pendingSubmit: (txHash?: Hex) =>
    transitStage(<TxStagePending title="Creating motion" txHash={txHash} />),

  successSubmit: (txHash?: Hex) =>
    transitStage(
      <TxStageSuccess
        title="Motion created successfully"
        txHash={txHash}
        description=""
      />,
      { isClosableOnLedger: true },
    ),
});

export const useTxModalMotion = () => {
  return useTransactionModalStage(getTxModalStagesMotion);
};
