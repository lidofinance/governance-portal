import {
  ObjectionsInfo,
  ObjectionsTitle,
  ObjectionsPercents,
  ObjectionsValue,
  ObjectionsThreshold,
} from './style';

import { Motion, MotionStatus, RawMotionSubgraph } from '../types';
import { useMotionProgress } from '../hooks/use-motion-progress';

type Props = {
  motion: Motion | RawMotionSubgraph;
};

export const MotionDetailedObjections = ({ motion }: Props) => {
  const progress = useMotionProgress(motion);

  const isSucceed = motion.status === MotionStatus.ENACTED;
  const isDangered =
    !isSucceed &&
    (motion.status === MotionStatus.REJECTED ||
      Boolean(progress && progress.objectionsPct > 0));

  return (
    <ObjectionsInfo isSucceed={isSucceed} isDangered={isDangered}>
      <ObjectionsTitle>Objections:</ObjectionsTitle>
      <ObjectionsValue>
        {!progress ? (
          'Loading...'
        ) : (
          <>
            <span>
              {progress.objectionsAmount.toLocaleString('en-EN')}/
              {progress.thresholdAmount.toLocaleString('en-EN')}
            </span>
            <ObjectionsThreshold />
          </>
        )}
      </ObjectionsValue>
      <ObjectionsPercents
        title={!progress ? undefined : `${progress.objectionsPctFormatted}%`}
      >
        {!progress ? '...' : `${progress.objectionsPctFormatted}%`}
      </ObjectionsPercents>
    </ObjectionsInfo>
  );
};
