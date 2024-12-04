import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { escrowAbi } from 'abi/ts';
import { Token } from 'shared/blockchain/types';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';

export const useRevokeTxSend = (escrowAddress: Address | undefined) => {
  const writeEscrowContract = useWriteContract(escrowAbi);

  return useCallback(
    async (token: Token) => {
      invariant(escrowAddress, 'escrowAddress must be presented');

      const functionName =
        token === Token.stETH ? 'unlockStETH' : 'unlockWstETH';

      return writeEscrowContract({
        address: escrowAddress,
        functionName,
        args: [],
      });
    },
    [escrowAddress, writeEscrowContract],
  );
};
