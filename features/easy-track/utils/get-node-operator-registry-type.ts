import {
  IncreaseLimitMotionType,
  INCREASE_LIMIT_MOTION_MAP,
} from '../constants';

export const getNodeOperatorRegistryType = (
  motionType: IncreaseLimitMotionType,
) => {
  return INCREASE_LIMIT_MOTION_MAP[motionType].registryType;
};
