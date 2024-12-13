import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { SupportFormInputType } from './support-form-context';
import { escrowAbi } from 'abi/ts';
import { Token } from 'shared/blockchain/types';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';

export const useSupportVetoTxSend = (escrowAddress: Address | undefined) => {
  const writeEscrowContract = useWriteContract(escrowAbi);

  return useCallback(
    async ({ amount, token, selectedNftIds }: SupportFormInputType) => {
      invariant(escrowAddress, 'escrowAddress must be presented');

      if (token === Token.unstETH) {
        invariant(selectedNftIds, 'selectedNftIds must be presented');

        const ids = Object.keys(selectedNftIds)
          .filter((key) => selectedNftIds[Number(key)])
          .map(BigInt);

        return writeEscrowContract({
          address: escrowAddress,
          functionName: 'lockUnstETH',
          args: [ids],
        });
      }

      invariant(amount, 'amount must be presented');

      const functionName = token === Token.stETH ? 'lockStETH' : 'lockWstETH';

      return writeEscrowContract({
        address: escrowAddress,
        functionName,
        args: [amount],
      });
    },
    [escrowAddress, writeEscrowContract],
  );
};
