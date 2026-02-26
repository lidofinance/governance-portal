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
import { SuccessText } from 'shared/blockchain/transaction-modal/tx-stages-parts/success-text';

const IN_PROGRESS_TEXT = 'Recovering order...';

const getTxModalStagesRecoverOrder = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: () =>
    transitStage(<TxStageSign title={IN_PROGRESS_TEXT} description="" />),

  pending: (txHash?: string) =>
    transitStage(<TxStagePending title={IN_PROGRESS_TEXT} txHash={txHash} />),

  success: (txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stonks order recovered!"
        description={<SuccessText txHash={txHash} />}
        showEtherscan={false}
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalRecoverOrder = () => {
  return useTransactionModalStage(getTxModalStagesRecoverOrder);
};
