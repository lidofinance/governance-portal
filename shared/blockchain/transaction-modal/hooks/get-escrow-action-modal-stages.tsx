import {
  EscrowActionWithEthArgs,
  isTokenAmountArgs,
  isWithdrawalNFTArgs,
} from 'features/dual-governance/types';
import { getGeneralTransactionModalStages } from './get-general-transaction-modal-stages';
import { TransactionModalTransitStage } from './use-transaction-modal-stage';
import { TxStageSignOperationAmount } from '../tx-stages-composed/tx-stage-amount-operation';
import { SuccessText } from '../tx-stages-parts/success-text';
import { TxStageSuccess } from '../tx-stages-basic';
import { Token } from 'shared/blockchain/types';

export const getEscrowActionModalStages = (
  operationText: string,
  successText: string,
) => {
  return (transitStage: TransactionModalTransitStage) => ({
    ...getGeneralTransactionModalStages(transitStage),

    sign: (args: EscrowActionWithEthArgs, shouldConvertShares?: boolean) =>
      transitStage(
        <TxStageSignOperationAmount
          operationText={operationText}
          {...args}
          shouldConvertShares={shouldConvertShares}
        />,
      ),

    pending: (
      args: EscrowActionWithEthArgs,
      txHash?: string,
      shouldConvertShares?: boolean,
    ) =>
      transitStage(
        <TxStageSignOperationAmount
          operationText={operationText}
          isPending
          txHash={txHash}
          shouldConvertShares={shouldConvertShares}
          {...args}
        />,
      ),
    success: (
      args: EscrowActionWithEthArgs,
      txHash?: string,
      shouldConvertShares?: boolean,
    ) => {
      // Show stake link only when revoking unstETH tokens
      const showStakeLink =
        args.token === Token.unstETH && operationText === 'revoking';

      return transitStage(
        <TxStageSuccess
          txHash={txHash}
          title={successText}
          description={<SuccessText txHash={txHash} />}
          showEtherscan={false}
          amount={isTokenAmountArgs(args) ? args.amount : null}
          nftIds={isWithdrawalNFTArgs(args) ? args.selectedNftIds : null}
          token={args.token}
          showStakeLink={showStakeLink}
          shouldConvertShares={shouldConvertShares}
        />,
        {
          isClosableOnLedger: true,
        },
      );
    },
  });
};
