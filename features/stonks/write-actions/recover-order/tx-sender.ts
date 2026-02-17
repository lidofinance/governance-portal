import { useCallback } from 'react';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { stonksOrderAbi } from 'abi/generated';
import { Address } from 'viem';

export const useRecoverOrderTxSender = (orderAddress: Address) => {
  const writeOrderContract = useWriteContract(stonksOrderAbi);

  return useCallback(
    async () =>
      writeOrderContract({
        address: orderAddress,
        functionName: 'recoverTokenFrom',
        args: [],
      }),
    [orderAddress, writeOrderContract],
  );
};
