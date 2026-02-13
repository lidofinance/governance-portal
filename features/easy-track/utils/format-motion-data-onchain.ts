import { Motion } from '../types';
import { getMotionStatus } from './get-motion-status';
import { Address, Hex } from 'viem';

type MotionCreatedEventLog = {
  args: {
    _motionId: bigint;
    _creator: `0x${string}`;
    _evmScriptFactory: `0x${string}`;
    _evmScriptCallData: `0x${string}`;
    _evmScript: `0x${string}`;
  };
};

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
  event: MotionCreatedEventLog,
  contractMotion: ContractMotion,
): Motion => {
  const motion: Motion = {
    ...contractMotion,
    evmScriptFactory: contractMotion.evmScriptFactory.toLowerCase() as Address,
    creator: contractMotion.creator.toLowerCase() as Hex,
    evmScript: event.args._evmScript,
    evmScriptCalldata: event.args._evmScriptCallData,
    isOnChain: true,
  };

  const status = getMotionStatus(motion);

  return {
    ...motion,
    status: status ?? undefined,
  };
};
