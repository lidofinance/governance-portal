import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { Hex } from 'viem';
import { useAccount } from 'wagmi';

import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { easyTrackAbi } from 'abi/generated';

export const useEnactMotionTxSender = () => {
  const { isConnected } = useAccount();
  const writeEasyTrackContract = useWriteContract(easyTrackAbi);
  const easyTrackAddress = useContractAddress(EasyTrack);

  return useCallback(
    async (motionId: bigint, calldata: Hex) => {
      invariant(isConnected, 'Wallet must be connected to proceed');

      return writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'enactMotion',
        args: [motionId, calldata],
      });
    },
    [isConnected, easyTrackAddress, writeEasyTrackContract],
  );
};
