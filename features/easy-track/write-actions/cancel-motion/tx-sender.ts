import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';

import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { easyTrackAbi } from 'abi/generated';

export const useCancelMotionTxSender = () => {
  const { isConnected } = useAccount();
  const writeEasyTrackContract = useWriteContract(easyTrackAbi);
  const easyTrackAddress = useContractAddress(EasyTrack);

  return useCallback(
    async (motionId: bigint) => {
      invariant(isConnected, 'Wallet must be connected to proceed');

      return writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'cancelMotion',
        args: [motionId],
      });
    },
    [isConnected, easyTrackAddress, writeEasyTrackContract],
  );
};
