import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { dgEscrowAbi } from 'abi/generated';
import { Token } from 'shared/blockchain/types';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { EscrowActionArgs } from 'features/dual-governance/types';

export const useSupportVetoTxSender = () => {
  const writeEscrowContract = useWriteContract(dgEscrowAbi);

  return useCallback(
    async (args: EscrowActionArgs) => {
      invariant(args.escrowAddress, 'escrowAddress must be presented');
      if (args.token === Token.unstETH) {
        invariant(args.selectedNftIds, 'ids must be presented');

        const ids = Object.keys(args.selectedNftIds)
          .filter((key) => args.selectedNftIds[Number(key)])
          .map(BigInt);

        return writeEscrowContract({
          address: args.escrowAddress,
          functionName: 'lockUnstETH',
          args: [ids],
        });
      }

      invariant(args.amount, 'amount must be presented');

      const functionName =
        args.token === Token.stETH ? 'lockStETH' : 'lockWstETH';

      return writeEscrowContract({
        address: args.escrowAddress,
        functionName,
        args: [args.amount],
      });
    },
    [writeEscrowContract],
  );
};
