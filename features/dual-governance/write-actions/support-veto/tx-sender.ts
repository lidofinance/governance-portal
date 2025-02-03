import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { escrowAbi } from 'abi/ts';
import { Token } from 'shared/blockchain/types';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { EscrowActionArgs } from 'features/dual-governance/types';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const useSupportVetoTxSender = () => {
  const { vetoSignallingAddress } = useDualGovernanceContext();
  const writeEscrowContract = useWriteContract(escrowAbi);

  return useCallback(
    async (args: EscrowActionArgs) => {
      invariant(vetoSignallingAddress, 'escrowAddress must be presented');
      if (args.token === Token.unstETH) {
        invariant(args.selectedNftIds, 'ids must be presented');

        const ids = Object.keys(args.selectedNftIds)
          .filter((key) => args.selectedNftIds[Number(key)])
          .map(BigInt);

        return writeEscrowContract({
          address: vetoSignallingAddress,
          functionName: 'lockUnstETH',
          args: [ids],
        });
      }

      invariant(args.amount, 'amount must be presented');

      const functionName =
        args.token === Token.stETH ? 'lockStETH' : 'lockWstETH';

      return writeEscrowContract({
        address: vetoSignallingAddress,
        functionName,
        args: [args.amount],
      });
    },
    [vetoSignallingAddress, writeEscrowContract],
  );
};
