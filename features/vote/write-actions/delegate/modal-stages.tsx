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
import { DelegateTxArgs } from './types';

const getInProgressText = (args: DelegateTxArgs) => {
  return `You are delegating your voting power to ${args.delegateAddress} on ${args.type === 'aragon' ? 'Aragon' : 'Snapshot'}`;
};

const getTxModalStagesDelegate = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (args: DelegateTxArgs) =>
    transitStage(
      <TxStageSign title={getInProgressText(args)} description="" />,
    ),

  pending: (args: DelegateTxArgs, txHash?: string) =>
    transitStage(
      <TxStagePending title={getInProgressText(args)} txHash={txHash} />,
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

export const useTxModalDelegate = () => {
  return useTransactionModalStage(getTxModalStagesDelegate);
};
