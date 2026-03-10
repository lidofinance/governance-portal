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
