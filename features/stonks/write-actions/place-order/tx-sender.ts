import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { stonksV2Abi } from 'abi/generated';
import { PlaceOrderFormInput, StonksMetadata } from '@stonks/types';

export const usePlaceOrderTxSender = ({ version, address }: StonksMetadata) => {
  // using stonks v2 abi because it has both `placeOrder` from v1 and new `placeOrderWithAmount`
  const writeStonksContract = useWriteContract(stonksV2Abi);

  return useCallback(
    async ({ minBuyAmount, sellAmount }: PlaceOrderFormInput) => {
      invariant(address, 'stonksAddress must be presented');

      if (version === 1) {
        return writeStonksContract({
          address,
          functionName: 'placeOrder',
          args: [minBuyAmount],
        });
      }

      return writeStonksContract({
        address,
        functionName: 'placeOrderWithAmount',
        args: [sellAmount, minBuyAmount],
      });
    },

    [address, version, writeStonksContract],
  );
};
