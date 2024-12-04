import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import { TxStageSignOperationAmount } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-amount-operation';
import { TxStageOperationSucceedBalanceShown } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-operation-succeed-balance-shown';
import { Token } from 'shared/blockchain/types';

const STAGE_APPROVE_TEXT = 'approving';

const STAGE_OPERATION_TEXT = 'supporting veto with';

const getTxModalStagesSupport = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  signApproval: (amount: bigint, token: Token) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        amount={amount}
        token={token}
      />,
    ),

  pendingApproval: (amount: bigint, token: Token, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),

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
        operationText={'Supporting veto'}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useTxModalSupport = () => {
  return useTransactionModalStage(getTxModalStagesSupport);
};
