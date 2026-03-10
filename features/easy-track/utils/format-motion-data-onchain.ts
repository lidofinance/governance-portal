import { Motion } from '../types';
import { getMotionStatus } from './get-motion-status';
import { Address, Hex } from 'viem';
import { MotionCreatedEventLog } from './get-motion-created-event';

type ContractMotion = {
  id: bigint;
  evmScriptFactory: `0x${string}`;
  creator: `0x${string}`;
  duration: bigint;
  startDate: bigint;
  snapshotBlock: bigint;
  objectionsThreshold: bigint;
  objectionsAmount: bigint;
  evmScriptHash: `0x${string}`;
};

export const formatMotionDataOnchain = (
  event: MotionCreatedEventLog | undefined,
  contractMotion: ContractMotion,
): Motion => {
  const motion: Motion = {
    ...contractMotion,
    evmScriptFactory: contractMotion.evmScriptFactory.toLowerCase() as Address,
    creator: contractMotion.creator.toLowerCase() as Hex,
    evmScript: event?.args._evmScript,
    evmScriptCalldata: event?.args._evmScriptCallData,
    isOnChain: true,
  };

  const status = getMotionStatus(motion);

  return {
    ...motion,
    status: status ?? undefined,
  };
};
