import { Divider } from '@lidofinance/lido-ui';

import { MotionDetailedLimitsWrapper } from './style';
import { MotionLimitProgress } from '@easy-track/motion-limit-progress';
import { MotionInfoBox } from '@easy-track/start-motion/parts/style';
import { useMotionContext } from '@easy-track/providers/motion-detailed-context';

export const MotionDetailedLimits = () => {
  const {
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
    canEnactInNextPeriod,
    isArchived,
  } = useMotionContext();

  if (!periodLimitsData || isArchived) return null;

  return (
    <>
      <Divider indents="md" />
      <MotionDetailedLimitsWrapper>
        <MotionLimitProgress
          spentAmount={periodLimitsData.periodData.alreadySpentAmount}
          totalLimit={periodLimitsData.limits.limit}
          startDate={periodLimitsData.periodData.periodStartTimestamp}
          endDate={periodLimitsData.periodData.periodEndTimestamp}
          token={motionTopUpToken}
          newAmount={motionTopUpAmount}
          showAmountChange
        />
      </MotionDetailedLimitsWrapper>
      {isOverPeriodLimit && !canEnactInNextPeriod && (
        <MotionInfoBox $variant="error">
          Motion can&apos;t be enacted as the transfer value is greater than the
          period limit.
        </MotionInfoBox>
      )}
      {canEnactInNextPeriod && isOverPeriodLimit && (
        <MotionInfoBox>
          Motion can&apos;t be enacted before the period limits are replenished.
        </MotionInfoBox>
      )}
    </>
  );
};
