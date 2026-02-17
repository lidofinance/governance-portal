import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { OffChainOrderStatus, OrderData } from '@stonks/types';
import { API_ROUTES } from 'constants/api';
import { standardFetcher } from 'utils/standard-fetcher';

type CowApiOrder = {
  creationDate: string;
  uid: string;
  validTo: number;
  sellToken: string;
  executedSellAmount: string;
  executedBuyAmount: string;
  status: OffChainOrderStatus;
};

export const useCowOrderData = (order: OrderData | undefined) => {
  const { chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['cow-order-data', chainId, order?.address],
    enabled: !!order?.address,
    queryFn: async () => {
      if (!order?.address) {
        return;
      }

      const ordersByOwner = await standardFetcher<CowApiOrder[] | undefined>(
        `/${API_ROUTES.COW_GET_ORDER}?address=${order.address}`,
      );

      if (!ordersByOwner?.length) {
        return null;
      }

      const offChainOrder = ordersByOwner[0];

      const orderTransactions = await standardFetcher<
        { txHash: string }[] | undefined
      >(`/${API_ROUTES.COW_GET_TRADES}?orderUid=${offChainOrder.uid}`);

      const executedSellAmount = BigInt(offChainOrder.executedSellAmount);
      const executedBuyAmount = BigInt(offChainOrder.executedBuyAmount);

      const sellAmountFulfillmentPct = order.sellAmount
        ? (executedSellAmount * 100n) / order.sellAmount
        : 0n;
      const buyAmountFulfillmentPct = order.buyAmount
        ? (executedBuyAmount * 100n) / order.buyAmount
        : 0n;

      return {
        uid: offChainOrder.uid,
        creationDate: offChainOrder.creationDate,
        status: offChainOrder.status,
        executedBuyAmount,
        executedSellAmount,
        sellAmountFulfillmentPct,
        buyAmountFulfillmentPct,
        transactions: orderTransactions ?? [],
      };
    },
  });
};
