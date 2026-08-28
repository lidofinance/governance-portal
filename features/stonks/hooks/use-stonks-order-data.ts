import { useQuery } from '@tanstack/react-query';
import { erc20Abi, stonksOrderAbi, stonksV2Abi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';
import { getCode } from 'viem/actions';
import { MIN_STONKS_BALANCE_WEI } from '@stonks/constants';
import { STONKS_MAP } from '@stonks/addresses';
import { isAddress } from 'viem';
import { OrderData } from '@stonks/types';

const isValidAddress = (address: string | undefined): address is Address =>
  !!address && isAddress(address);

export const useStonksOrderData = (orderAddress: string | undefined) => {
  const { chainId, rpcProvider } = useLidoSDK();

  const getOrderContract = useReadContractGetter(stonksOrderAbi);
  const getStonksContract = useReadContractGetter(stonksV2Abi);
  const getErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery<OrderData>({
    queryKey: ['stonks-order-data', chainId, orderAddress],
    enabled: isValidAddress(orderAddress),
    queryFn: async () => {
      if (!isValidAddress(orderAddress)) {
        throw new Error(`Invalid order address`);
      }

      const orderContractReader = getOrderContract(orderAddress);

      const stonksAddress = await orderContractReader('stonks');

      const stonksMetadata = STONKS_MAP[chainId]?.find(
        (metadata) =>
          metadata.address.toLowerCase() === stonksAddress?.toLowerCase(),
      );

      if (!stonksMetadata) {
        throw new Error(
          `Order ${orderAddress} was not created by a known Stonks contract`,
        );
      }

      const stonksContractReader = getStonksContract(stonksMetadata.address);

      const [orderSample, orderCode] = await Promise.all([
        stonksContractReader('ORDER_SAMPLE'),
        getCode(rpcProvider, { address: orderAddress }),
      ]);

      // Orders are EIP-1167 clones (fixed prefix + implementation + fixed suffix) of
      // the immutable ORDER_SAMPLE, and Order.initialize stores its caller as stonks().
      // So a real clone naming a known Stonks contract was created by that contract.
      const expectedCode = `0x363d3d373d3d3d363d73${orderSample.slice(2)}5af43d82803e903d91602b57fd5bf3`;

      if (orderCode?.toLowerCase() !== expectedCode.toLowerCase()) {
        throw new Error(`Order ${orderAddress} is not a Stonks order contract`);
      }

      const [, tokenFromAddress, , sellAmount, buyAmount, validTo] =
        await orderContractReader('getOrderDetails');

      const isExpired = Date.now() / 1000 > validTo;

      const tokenFromReader = getErc20Contract(tokenFromAddress);

      const tokenFromBalance = await tokenFromReader('balanceOf', [
        orderAddress,
      ]);

      const hasBalance = tokenFromBalance >= MIN_STONKS_BALANCE_WEI;

      const isRecoverable = isExpired && hasBalance;
      const recoverableAmount = isRecoverable ? tokenFromBalance : 0n;

      // Stonks v2 settles to a configurable RECEIVER, while v1 bakes the order's own
      // AGENT into the CoW order, so that is the value the payload has to match.
      let receiverAddress: Address | null = null;
      if (stonksMetadata.version === 2) {
        receiverAddress = await stonksContractReader('RECEIVER');
      }

      if (!receiverAddress) {
        receiverAddress = await orderContractReader('AGENT');
      }

      // reads return null on failure, and a null receiver would break the CoW payload
      if (!receiverAddress) {
        throw new Error(
          `Could not resolve the receiver for order ${orderAddress}`,
        );
      }

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
