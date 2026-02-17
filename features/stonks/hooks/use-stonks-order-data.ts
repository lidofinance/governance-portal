import { useQuery } from '@tanstack/react-query';
import { erc20Abi, stonksOrderAbi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { MIN_STONKS_BALANCE_WEI } from '@stonks/constants';
import { STONKS_MAP } from '@stonks/addresses';
import { isAddress } from 'viem';
import { OrderData } from '@stonks/types';
import { AragonAgent } from 'shared/blockchain/contract-addresses';

export const useStonksOrderData = (orderAddress: string) => {
  const { chainId } = useLidoSDK();

  const getOrderContract = useReadContractGetter(stonksOrderAbi);
  const getErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery<OrderData>({
    queryKey: ['stonks-order-data', chainId, orderAddress],
    enabled: isAddress(orderAddress),
    queryFn: async () => {
      if (!isAddress(orderAddress)) {
        throw new Error(`Invalid order address`);
      }
      const orderContractReader = getOrderContract(orderAddress);
      let stonksAddress: Address;

      try {
        stonksAddress = await orderContractReader('stonks');
      } catch (error) {
        throw new Error(`Could not fetch stonks address for order: ${error}`);
      }

      const stonksMetadata = STONKS_MAP[chainId]?.find(
        (s) => s.address === stonksAddress.toLowerCase(),
      );

      if (!stonksMetadata) {
        throw new Error(
          `Could not link stonks order to stonks contract: ${stonksAddress}`,
        );
      }

      const [, tokenFromAddress, , sellAmount, buyAmount, validTo] =
        await orderContractReader('getOrderDetails');

      const isExpired = Date.now() / 1000 > validTo;

      const tokenFromReader = getErc20Contract(tokenFromAddress);

      const tokenFromBalance = await tokenFromReader('balanceOf', [
        orderAddress,
      ]);

      const hasBalance = tokenFromBalance > MIN_STONKS_BALANCE_WEI;

      const isRecoverable = isExpired && hasBalance;
      const recoverableAmount = isRecoverable ? tokenFromBalance : 0n;

      // TODO: update receiver address logic after Stonks dynamic receiver implementation
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const receiverAddress = AragonAgent[chainId]! as Address;

      return {
        address: orderAddress,
        receiverAddress,
        stonksMetadata,
        validTo,
        sellAmount,
        buyAmount,
        isRecoverable,
        recoverableAmount,
        isExpired,
        hasBalance,
      };
    },
  });
};
