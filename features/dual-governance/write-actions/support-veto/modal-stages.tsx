import { EscrowActionArgs } from '@dg/types';
import { getEscrowActionModalStages } from 'shared/blockchain/transaction-modal/hooks/get-escrow-action-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/blockchain/transaction-modal/hooks/use-transaction-modal-stage';
import { TxStageSignOperationAmount } from 'shared/blockchain/transaction-modal/tx-stages-composed/tx-stage-amount-operation';

const STAGE_APPROVE_TEXT = 'unlocking';

const getTxModalStagesSupport = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getEscrowActionModalStages(
    'supporting veto with',
    'You have supported veto with',
  )(transitStage),

  signApproval: (args: EscrowActionArgs, shouldConvertShares?: boolean) => {
    return transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        shouldConvertShares={shouldConvertShares}
        {...args}
      />,
    );
  },

  pendingApproval: (
    args: EscrowActionArgs,
    txHash?: string,
    shouldConvertShares?: boolean,
  ) => {
    return transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        isPending
        txHash={txHash}
        shouldConvertShares={shouldConvertShares}
        {...args}
      />,
    );
  },
});

export const useTxModalSupport = () => {
  return useTransactionModalStage(getTxModalStagesSupport);
};
