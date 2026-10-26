import { Motion } from '../types';
import { getMotionStatus } from './get-motion-status';
import { Address, Hex } from 'viem';
import {
  isEventForMotion,
  MotionCreatedEventLog,
} from './get-motion-created-event';

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
  const eventArgs =
    event && isEventForMotion(event, contractMotion) ? event.args : undefined;

  const motion: Motion = {
    ...contractMotion,
    evmScriptFactory: contractMotion.evmScriptFactory.toLowerCase() as Address,
    creator: contractMotion.creator.toLowerCase() as Hex,
    evmScript: eventArgs?._evmScript,
    evmScriptCalldata: eventArgs?._evmScriptCallData,
    isOnChain: true,
  };

  const status = getMotionStatus(motion);

  return {
    ...motion,
    status: status ?? undefined,
  };
};
