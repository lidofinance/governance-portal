import { DelegationType } from 'features/vote/types';
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

const getInProgressText = (type: DelegationType) => {
  return `You are revoking your delegation on ${type === 'aragon' ? 'Aragon' : 'Snapshot'}`;
};

const getTxModalStagesRevokeDelegation = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (type: DelegationType) =>
    transitStage(
      <TxStageSign title={getInProgressText(type)} description="" />,
    ),

  pending: (type: DelegationType, txHash?: string) =>
    transitStage(
      <TxStagePending title={getInProgressText(type)} txHash={txHash} />,
    ),

  success: (txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Delegate set successfully!"
        description={<SuccessText txHash={txHash} />}
        showEtherscan={false}
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalRevokeDelegation = () => {
  return useTransactionModalStage(getTxModalStagesRevokeDelegation);
};
