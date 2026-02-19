import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { CowApiOrder, CowApiTrade, OrderData } from '@stonks/types';
import { API_ROUTES } from 'constants/api';
import { standardFetcher } from 'utils/standard-fetcher';

export const useCowOrderData = (order: OrderData | undefined) => {
  const { chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['cow-order-data', chainId, order?.address],
    enabled: !!order?.address,
    queryFn: async () => {
      if (!order?.address) {
        return;
      }

      const cowOrder = await standardFetcher<CowApiOrder | null | undefined>(
        `/${API_ROUTES.COW_GET_ORDER}?address=${order.address}&chainId=${chainId}`,
      );

      if (!cowOrder) {
        return null;
      }

      const orderTransactions = await standardFetcher<CowApiTrade[]>(
        `/${API_ROUTES.COW_GET_TRADES}?orderUid=${cowOrder.uid}&chainId=${chainId}`,
      );

      const executedSellAmount = BigInt(cowOrder.executedSellAmount);
      const executedBuyAmount = BigInt(cowOrder.executedBuyAmount);

      const sellAmountFulfillmentPct = order.sellAmount
        ? (executedSellAmount * 100n) / order.sellAmount
        : 0n;
      const buyAmountFulfillmentPct = order.buyAmount
        ? (executedBuyAmount * 100n) / order.buyAmount
        : 0n;

      return {
        uid: cowOrder.uid,
        creationDate: cowOrder.creationDate,
        status: cowOrder.status,
        executedBuyAmount,
        executedSellAmount,
        sellAmountFulfillmentPct,
        buyAmountFulfillmentPct,
        transactions: orderTransactions ?? [],
      };
    },
  });
};
