import { decodeAbiParameters, parseAbiParameters, type Hex } from 'viem';
import { FACTORY_ACTION_TITLES, type FactoryName } from '../factories-metadata';
import type { EvmUnrecognized } from '../evm-addresses';
import type { MotionType } from '../motion-types';
import { getMotionTypeDisplayName } from './get-motion-type-display-name';

// Multi-action factories wrap their payload in `abi.encode(Action, bytes)`, so
// the ordinal is readable without the factory ABI or a network call.
const decodeActionOrdinal = (callData: Hex) => {
  try {
    const [action] = decodeAbiParameters(
      parseAbiParameters('uint8, bytes'),
      callData,
    );
    return action;
  } catch {
    return null;
  }
};

// Title shown on motion cards. Falls back to the factory display name for
// single-action factories and for calldata that fails to decode.
export const getMotionTitle = (
  motionType: MotionType | EvmUnrecognized,
  evmScriptCalldata: string | undefined,
) => {
  const actionTitles = FACTORY_ACTION_TITLES[motionType as FactoryName];

  if (!actionTitles || !evmScriptCalldata) {
    return getMotionTypeDisplayName(motionType);
  }

  const action = decodeActionOrdinal(evmScriptCalldata as Hex);

  return (
    (action === null ? undefined : actionTitles[action]) ??
    getMotionTypeDisplayName(motionType)
  );
};
