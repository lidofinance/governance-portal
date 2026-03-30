import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { dgEscrowAbi } from 'abi/generated';
import { EscrowActionWithEthArgs } from '@dg/types';

export const useWithdrawEthTxSender = () => {
  const writeEscrowContract = useWriteContract(dgEscrowAbi);

  return useCallback(
    async (args: EscrowActionWithEthArgs) => {
      invariant(args.escrowAddress, 'rageQuitAddress must be presented');

      if (args.token === 'Withdrawal NFT') {
        invariant(args.selectedNftIds.length > 0, 'ids must be presented');

        return writeEscrowContract({
          address: args.escrowAddress,
          functionName: 'withdrawETH',
          args: [args.selectedNftIds.map(BigInt)],
        });
      }

      return writeEscrowContract({
        address: args.escrowAddress,
        functionName: 'withdrawETH',
        args: [],
      });
    },
    [writeEscrowContract],
  );
};
