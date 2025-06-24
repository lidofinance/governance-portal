import { EscrowActionArgs } from 'features/dual-governance/types';
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

  signApproval: (args: EscrowActionArgs) => {
    return transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        convertShares={false}
        {...args}
      />,
    );
  },

  pendingApproval: (args: EscrowActionArgs, txHash?: string) => {
    return transitStage(
      <TxStageSignOperationAmount
        operationText={STAGE_APPROVE_TEXT}
        isPending
        txHash={txHash}
        convertShares={false}
        {...args}
      />,
    );
  },
});

export const useTxModalSupport = () => {
  return useTransactionModalStage(getTxModalStagesSupport);
};
