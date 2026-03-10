import { Motion, RawMotionSubgraph } from '../types';
import { Hex } from 'viem';

export const formatMotionDataSubgraph = (raw: RawMotionSubgraph): Motion => {
  return {
    id: BigInt(raw.id),
    evmScriptFactory: raw.evmScriptFactory.toLowerCase() as Hex,
    creator: raw.creator.toLowerCase() as Hex,
    duration: BigInt(raw.duration),
    startDate: BigInt(raw.startDate),
    snapshotBlock: BigInt(raw.snapshotBlock),
    objectionsThreshold: BigInt(raw.objectionsThreshold),
    objectionsAmount: BigInt(raw.objectionsAmount),
    evmScriptHash: raw.evmScriptHash as Hex,
    status: raw.status,
    enacted_at: raw.enacted_at ? Number(raw.enacted_at) : undefined,
    evmScriptCalldata: raw.evmScriptCalldata as Hex,
    isOnChain: false,
  };
};
