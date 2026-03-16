import {
  ObjectionsInfo,
  ObjectionsTitle,
  ObjectionsPercents,
  ObjectionsValue,
  ObjectionsThreshold,
} from './style';

import { Motion, MotionStatus, RawMotionSubgraph } from '../types';
import { useMotionContext } from '../providers/motion-detailed-context';

type Props = {
  motion: Motion | RawMotionSubgraph;
};

export const MotionDetailedObjections = ({ motion }: Props) => {
  const { progress } = useMotionContext();

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
              {progress.objectionsAmountFormatted}/
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
