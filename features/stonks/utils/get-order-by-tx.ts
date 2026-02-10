import { parseEventLogs, TransactionReceipt } from 'viem';
import { stonksOrderAbi } from 'abi/generated';

type OrderData = {
  sellToken: string;
  buyToken: string;
  receiver: string;
  sellAmount: string;
  buyAmount: string;
  validTo: number;
  feeAmount: string;
  kind: string;
  partiallyFillable: boolean;
  sellTokenBalance: string;
  buyTokenBalance: string;
  appData: string;
};

type OrderFromReceipt = {
  address: string;
  hash: string;
  orderData: OrderData;
};

export const getOrderByPlaceTxReceipt = (
  receipt: TransactionReceipt,
): OrderFromReceipt => {
  const logs = parseEventLogs({
    abi: stonksOrderAbi,
    logs: receipt.logs,
    eventName: 'OrderCreated',
  });

  const orderCreatedLog = logs[0];

  if (!orderCreatedLog) {
    throw new Error('Unable to extract order from transaction');
  }

  const { orderData } = orderCreatedLog.args;

  return {
    address: orderCreatedLog.args.order,
    hash: orderCreatedLog.args.orderHash,
    orderData: {
      sellToken: orderData.sellToken,
      buyToken: orderData.buyToken,
      receiver: orderData.receiver,
      sellAmount: orderData.sellAmount.toString(),
      buyAmount: orderData.buyAmount.toString(),
      validTo: orderData.validTo,
      // feeAmount is always 0 by design
      feeAmount: orderData.feeAmount.toString(),
      kind: orderData.kind,
      partiallyFillable: orderData.partiallyFillable,
      sellTokenBalance: orderData.sellTokenBalance,
      buyTokenBalance: orderData.buyTokenBalance,
      appData: orderData.appData,
    },
  };
};
