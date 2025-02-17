import { useCallback } from 'react';
import { Address } from 'viem';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import { escrowAbi } from 'abi/ts';
import invariant from 'tiny-invariant';

export const useClaimCustomNftTxSend = () => {
  const readWithdrawalQueue = useReadContract(WithdrawalQueue);
  const writeEscrow = useWriteContract(escrowAbi);

  return useCallback(
    async (nftIds: string[], escrowAddress: Address) => {
      invariant(nftIds, 'NFT Id must be provided');
      invariant(escrowAddress, 'Escrow address must be provided');
      try {
        const lastCheckpointIndex = await readWithdrawalQueue.readContract(
          'getLastCheckpointIndex',
        );
        const hints = await readWithdrawalQueue.readContract(
          'findCheckpointHints',
          [nftIds.map((nftId) => BigInt(nftId)), 1n, lastCheckpointIndex],
        );

        return await writeEscrow({
          address: escrowAddress,
          functionName: 'claimUnstETH',
          args: [nftIds.map((nftId) => BigInt(nftId)), hints],
        });
      } catch (error) {
        console.error('Error claiming NFT:', error);
        throw error;
      }
    },
    [readWithdrawalQueue, writeEscrow],
  );
};
