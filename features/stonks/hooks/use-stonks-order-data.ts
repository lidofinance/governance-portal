import { useQuery } from '@tanstack/react-query';
import { erc20Abi, stonksOrderAbi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address, getContractAddress, PublicClient } from 'viem';
import { getTransactionCount } from 'viem/actions';
import { MIN_STONKS_BALANCE_WEI } from '@stonks/constants';
import { STONKS_MAP } from '@stonks/addresses';
import { isAddress } from 'viem';
import { OrderData } from '@stonks/types';
import { AragonAgent } from 'shared/blockchain/contract-addresses';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const isValidAddress = (address: string | undefined): address is Address =>
  !!address && isAddress(address);

// Stonks places every order with Clones.clone, so an order address is always
// CREATE(stonks, nonce) for a nonce below the current nonce of that Stonks
// contract. Enumerating them proves who created the order, unlike stonks().
const findOrderCreator = async (
  client: PublicClient,
  chainId: CHAINS,
  orderAddress: Address,
) => {
  const stonksList = STONKS_MAP[chainId] ?? [];
  if (stonksList.length === 0) {
    return null;
  }

  const matches = await Promise.all(
    stonksList.map(async (stonksMetadata) => {
      const nonce = await getTransactionCount(client, {
        address: stonksMetadata.address,
      });

      for (let i = 1; i < nonce; i++) {
        const createdAddress = getContractAddress({
          from: stonksMetadata.address,
          nonce: BigInt(i),
        });

        if (createdAddress.toLowerCase() === orderAddress.toLowerCase()) {
          return stonksMetadata;
        }
      }

      return null;
    }),
  );

  return matches.find(Boolean) ?? null;
};

export const useStonksOrderData = (orderAddress: string | undefined) => {
  const { chainId, rpcProvider } = useLidoSDK();

  const getOrderContract = useReadContractGetter(stonksOrderAbi);
  const getErc20Contract = useReadContractGetter(erc20Abi);

  return useQuery<OrderData>({
    queryKey: ['stonks-order-data', chainId, orderAddress],
    enabled: isValidAddress(orderAddress),
    queryFn: async () => {
      if (!isValidAddress(orderAddress)) {
        throw new Error(`Invalid order address`);
      }
      const stonksMetadata = await findOrderCreator(
        rpcProvider,
        chainId,
        orderAddress,
      );

      if (!stonksMetadata) {
        throw new Error(
          `Order ${orderAddress} was not created by a known Stonks contract`,
        );
      }

      const orderContractReader = getOrderContract(orderAddress);

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
