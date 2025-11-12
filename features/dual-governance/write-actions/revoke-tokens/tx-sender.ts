import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { dgEscrowAbi } from 'abi/generated';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useEscrowContext } from 'providers/escrow';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';

export const useRevokeTokensTxSender = () => {
  const { vetoSignallingAddress } = useEscrowContext();
  const writeEscrowContract = useWriteContract(dgEscrowAbi);

  return useCallback(
    async (args: EscrowActionArgs) => {
      invariant(vetoSignallingAddress, 'escrowAddress must be presented');

      if (args.token === Token.unstETH) {
        return writeEscrowContract({
          address: vetoSignallingAddress,
          functionName: 'unlockUnstETH',
          args: [args.selectedNftIds.map(BigInt)],
        });
      }

      const functionName =
        args.token === Token.stETH ? 'unlockStETH' : 'unlockWstETH';

      return writeEscrowContract({
        address: vetoSignallingAddress,
        functionName,
        args: [],
      });
    },
    [vetoSignallingAddress, writeEscrowContract],
  );
};
