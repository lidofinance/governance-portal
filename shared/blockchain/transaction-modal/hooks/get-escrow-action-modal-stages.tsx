import { EscrowActionWithEthArgs } from 'features/dual-governance/types';
import { getGeneralTransactionModalStages } from './get-general-transaction-modal-stages';
import { TransactionModalTransitStage } from './use-transaction-modal-stage';
import { TxStageSignOperationAmount } from '../tx-stages-composed/tx-stage-amount-operation';
import { TxStageOperationSucceedBalanceShown } from '../tx-stages-composed/tx-stage-operation-succeed-balance-shown';

export const getEscrowActionModalStages = (operationText: string) => {
  return (transitStage: TransactionModalTransitStage) => ({
    ...getGeneralTransactionModalStages(transitStage),

    sign: (args: EscrowActionWithEthArgs) =>
      transitStage(
        <TxStageSignOperationAmount operationText={operationText} {...args} />,
      ),

    pending: (args: EscrowActionWithEthArgs, txHash?: string) =>
      transitStage(
        <TxStageSignOperationAmount
          operationText={operationText}
          isPending
          txHash={txHash}
          {...args}
        />,
      ),

    success: (
      args: EscrowActionWithEthArgs,
      txHash?: string,
      balance?: bigint,
    ) =>
      transitStage(
        <TxStageOperationSucceedBalanceShown
          txHash={txHash}
          token={args.token}
          balance={balance}
          operationText={operationText}
        />,
        {
          isClosableOnLedger: true,
        },
      ),
  });
};
