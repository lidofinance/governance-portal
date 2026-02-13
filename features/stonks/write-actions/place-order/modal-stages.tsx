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
import { PlaceOrderFormInput, StonksMetadata } from '@stonks/types';
import { formatToken } from 'shared/blockchain/utils';

type Args = PlaceOrderFormInput & { stonksMetadata: StonksMetadata };

const getInProgressText = (args: Args) => {
  // TODO: decimals and symbols
  return `Placing order to sell ${formatToken({
    amount: args.sellAmount,
    decimals: args.stonksMetadata.tokenFrom.decimals,
    symbol: args.stonksMetadata.tokenFrom.symbol,
  })} for at least ${formatToken({
    amount: args.minBuyAmount,
    decimals: args.stonksMetadata.tokenTo.decimals,
    symbol: args.stonksMetadata.tokenTo.symbol,
  })}`;
};

const getTxModalStagesPlaceOrder = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: (args: Args) =>
    transitStage(
      <TxStageSign title={getInProgressText(args)} description="" />,
    ),

  pending: (args: Args, txHash?: string) =>
    transitStage(
      <TxStagePending title={getInProgressText(args)} txHash={txHash} />,
    ),

  success: (txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Stonks order placed!"
        description={<SuccessText txHash={txHash} />}
        showEtherscan={false}
      />,
      {
        isClosableOnLedger: true,
      },
    );
  },
});

export const useTxModalPlaceOrder = () => {
  return useTransactionModalStage(getTxModalStagesPlaceOrder);
};
