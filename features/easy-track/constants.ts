import { MotionType } from './motion-types';
import {
  EvmNodeOperatorIncreaseLimit,
  EvmSandboxNodeOperatorIncreaseLimit,
} from 'shared/blockchain/contracts';

export const MOTION_ATTENTION_PERIOD = 1 / 24;

export const INCREASE_LIMIT_MOTION_MAP = {
  [MotionType.NodeOperatorIncreaseLimit]: {
    evmContract: EvmNodeOperatorIncreaseLimit,
    registryType: 'curated',
    motionType: MotionType.NodeOperatorIncreaseLimit,
  },
  [MotionType.SandboxNodeOperatorIncreaseLimit]: {
    evmContract: EvmSandboxNodeOperatorIncreaseLimit,
    registryType: 'sandbox',
    motionType: MotionType.SandboxNodeOperatorIncreaseLimit,
  },
} as const;

export type IncreaseLimitMotionType = keyof typeof INCREASE_LIMIT_MOTION_MAP;
