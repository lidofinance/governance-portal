import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';

export const VetoSignallingAdditionalSupportInfo = () => {
  const {
    detailedState,
    amountTillNextPhasePercent,
    nextPhaseSupportThresholdPercent,
  } = useDualGovernanceContext();

  const vetoSignallingEndDate = useMemo(() => {
    if (!detailedState) return;

    const { vetoSignallingDuration, vetoSignallingActivatedAt } = detailedState;

    const date = fromUnixTime(
      vetoSignallingActivatedAt + vetoSignallingDuration,
    );

    return {
      date: format(date, 'MMM d, h:mm a'),
      timezone: format(date, 'zzz'),
    };
  }, [detailedState]);

  if (typeof amountTillNextPhasePercent !== 'number') {
    return null;
  }

  // TODO: check UI when in veto signalling

  if (amountTillNextPhasePercent <= 0) {
    return (
      <Text color="secondary">
        RageQuit starts on {vetoSignallingEndDate?.date}{' '}
        {vetoSignallingEndDate?.timezone}, unless veto stETH support decreases
        below {nextPhaseSupportThresholdPercent}%
      </Text>
    );
  }

  return (
    <Text color="secondary">
      RageQuit starts if{' '}
      {amountTillNextPhasePercent &&
        Math.round(amountTillNextPhasePercent * 100) / 100}
      % more {Token.stETH} is added by {vetoSignallingEndDate?.date}{' '}
      {vetoSignallingEndDate?.timezone}; Otherwise, Deactivation begins
    </Text>
  );
};
