import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import { TxStageSignOperationAmount } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-amount-operation';
import { TxStageOperationSucceedBalanceShown } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-operation-succeed-balance-shown';
import { Token } from 'shared/blockchain/types';

const STAGE_OPERATION_TEXT = 'revoking tokens';

const getTxModalStagesRevoke = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (amount: bigint, token: Token) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_OPERATION_TEXT}
        amount={amount}
        token={token}
      />,
    ),

  pending: (amount: bigint, token: Token, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_OPERATION_TEXT}
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),

  success: (balance: bigint, token: Token, txHash?: string) =>
    transitStage(
      <TxStageOperationSucceedBalanceShown
        txHash={txHash}
        balance={balance}
        token={token}
        operationText={'Revoking tokens'}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalRevoke = () => {
  return useTransactionModalStage(getTxModalStagesRevoke);
};
