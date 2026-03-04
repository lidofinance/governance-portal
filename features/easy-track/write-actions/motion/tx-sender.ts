import { useCallback } from 'react';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { easyTrackAbi } from 'abi/generated';
import { Hex } from 'viem';

export const useMotionTxSender = () => {
  const writeEasyTrackContract = useWriteContract(easyTrackAbi);
  const easyTrackAddress = useContractAddress(EasyTrack);

  const objectMotionTxSender = useCallback(
    (motionId: bigint) => {
      return writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'objectToMotion',
        args: [motionId],
      });
    },
    [easyTrackAddress, writeEasyTrackContract],
  );

  const enactMotionTxSender = useCallback(
    (motionId: bigint, calldata: Hex) => {
      return writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'enactMotion',
        args: [motionId, calldata],
      });
    },
    [easyTrackAddress, writeEasyTrackContract],
  );

  const cancelMotionTxSender = useCallback(
    (motionId: bigint) => {
      return writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'cancelMotion',
        args: [motionId],
      });
    },
    [easyTrackAddress, writeEasyTrackContract],
  );

  return { objectMotionTxSender, enactMotionTxSender, cancelMotionTxSender };
};
