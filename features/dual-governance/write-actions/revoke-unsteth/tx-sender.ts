import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { escrowAbi } from 'abi/ts';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const useRevokeUnstethTxSend = () => {
  const { vetoSignallingAddress } = useDualGovernanceContext();
  const writeEscrowContract = useWriteContract(escrowAbi);

  return useCallback(
    async (ids: string[]) => {
      invariant(vetoSignallingAddress, 'escrowAddress must be presented');
      invariant(ids.length > 0, 'ids must be presented');

      return writeEscrowContract({
        address: vetoSignallingAddress,
        functionName: 'unlockUnstETH',
        args: [ids.map(BigInt)],
      });
    },
    [vetoSignallingAddress, writeEscrowContract],
  );
};
