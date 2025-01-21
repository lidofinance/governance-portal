import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { escrowAbi } from 'abi/ts';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { EscrowActionArgs } from 'features/dual-governance/types';

export const useWithdrawEthTxSender = () => {
  const { rageQuitAddress } = useDualGovernanceContext();

  const writeEscrowContract = useWriteContract(escrowAbi);

  return useCallback(
    async (args: EscrowActionArgs) => {
      invariant(rageQuitAddress, 'rageQuitAddress must be presented');

      if (args.token === 'unstETH') {
        invariant(args.ids.length > 0, 'ids must be presented');

        return writeEscrowContract({
          address: rageQuitAddress,
          functionName: 'withdrawETH',
          args: [args.ids.map(BigInt)],
        });
      }

      return writeEscrowContract({
        address: rageQuitAddress,
        functionName: 'withdrawETH',
        args: [],
      });
    },
    [rageQuitAddress, writeEscrowContract],
  );
};
