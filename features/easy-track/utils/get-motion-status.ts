import { Motion, RawMotionSubgraph } from '../types';
import { MotionDisplayStatus, MotionStatus } from '../types';
import { MotionProgress } from './get-motion-progress';

export const getIsMotionArchived = (
  motion: Motion | RawMotionSubgraph,
): boolean =>
  motion.status !== MotionStatus.ACTIVE &&
  motion.status !== MotionStatus.PENDING;

export const getMotionStatus = (motion: Motion) => {
  // If motion already has a final status (from subgraph), return it
  if (
    motion.status &&
    motion.status !== MotionStatus.ACTIVE &&
    motion.status !== MotionStatus.PENDING
  ) {
    return motion.status;
  }

  // Otherwise, calculate status based on time (for on-chain active motions)
  const now = Date.now();
  const destination = (motion.startDate + motion.duration) * 1000n;

  if (now < Number(destination)) {
    return MotionStatus.ACTIVE;
  }

  return MotionStatus.PENDING;
};

export const getMotionDisplayStatus = ({
  motion,
  progress,
  isAttentionTime,
}: {
  motion: Motion | RawMotionSubgraph;
  progress: MotionProgress | null;
  isAttentionTime: boolean;
}) => {
  const hasObjections = progress && progress.objectionsPct > 0;
  const isActive = motion.status === MotionStatus.ACTIVE;
  const isPending = motion.status === MotionStatus.PENDING;
  const isRejected = motion.status === MotionStatus.REJECTED;
  const isEnacted = motion.status === MotionStatus.ENACTED;

  if (isRejected || (hasObjections && isActive && !isAttentionTime)) {
    return MotionDisplayStatus.DANGER;
  }

  if ((isActive || isPending) && isAttentionTime && hasObjections) {
    return MotionDisplayStatus.ATTENDED_DANGER;
  }

  if ((isActive && isAttentionTime) || isPending) {
    return MotionDisplayStatus.ATTENDED;
  }

  if (isActive) {
    return MotionDisplayStatus.ACTIVE;
  }

  if (isEnacted) {
    return MotionDisplayStatus.ENACTED;
  }

  return MotionDisplayStatus.DEFAULT;
};
