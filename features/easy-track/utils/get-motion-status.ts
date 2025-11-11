import { Motion } from '../types';
import { MotionDisplayStatus, MotionStatus } from '../motion-types';
import { MotionProgress } from './get-motion-progress';

export const getMotionStatus = (motion: Motion) => {
  const now = Date.now();
  const destination = (motion.startDate + motion.duration) * 1000n;

  if (now < destination) {
    return MotionStatus.ACTIVE;
  }

  if (destination <= now) {
    return MotionStatus.PENDING;
  }

  return motion.status ? motion.status : null;
};

export const getMotionDisplayStatus = ({
  motion,
  progress,
  isAttentionTime,
}: {
  motion: Motion;
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
