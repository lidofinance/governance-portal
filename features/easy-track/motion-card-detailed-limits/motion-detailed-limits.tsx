import { Divider } from '@lidofinance/lido-ui';

import { MotionDetailedLimitsWrapper } from './MotionDetailedLimitsStyle';
import { MotionLimitProgress } from '@easy-track/motion-limit-progress';
import { MotionInfoBox } from '@easy-track/start-motion/parts/style';
import { useMotionDetailed } from '@easy-track/providers/motion-detailed-context';

export const MotionDetailedLimits = () => {
  const {
    periodLimitsData,
    motionTopUpAmount,
    motionTopUpToken,
    isOverPeriodLimit,
    isCanEnactInNextPeriod,
    isArchived,
  } = useMotionDetailed();

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
      {isOverPeriodLimit && !isCanEnactInNextPeriod && (
        <MotionInfoBox $variant="error">
          Motion can&apos;t be enacted as the transfer value is greater than the
          period limit.
        </MotionInfoBox>
      )}
      {isCanEnactInNextPeriod && isOverPeriodLimit && (
        <MotionInfoBox>
          Motion can&apos;t be enacted before the period limits are replenished.
        </MotionInfoBox>
      )}
    </>
  );
};
