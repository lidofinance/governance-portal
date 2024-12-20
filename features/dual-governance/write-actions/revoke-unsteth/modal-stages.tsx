import { getGeneralTransactionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import { TxStageSignOperationNftAmount } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-nft-amount-operation';
import { TxStageOperationSucceedBalanceShown } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-operation-succeed-balance-shown';
import { Token } from 'shared/blockchain/types';

const STAGE_OPERATION_TEXT = 'revoking';

const getTxModalStagesRevokeUnsteth = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (ids: string[]) =>
    transitStage(
      <TxStageSignOperationNftAmount
        operationText={STAGE_OPERATION_TEXT}
        ids={ids}
      />,
    ),

  pending: (ids: string[], txHash?: string) =>
    transitStage(
      <TxStageSignOperationNftAmount
        operationText={STAGE_OPERATION_TEXT}
        ids={ids}
        isPending
        txHash={txHash}
      />,
    ),

  success: (balance: bigint, txHash?: string) =>
    transitStage(
      <TxStageOperationSucceedBalanceShown
        txHash={txHash}
        balance={balance}
        token={Token.unstETH}
        operationText={'Revoking NFTs'}
      />,
      {
        isClosableOnLedger: true,
      },
    ),
});

export const useRevokeUnstethTxModal = () => {
  return useTransactionModalStage(getTxModalStagesRevokeUnsteth);
};
