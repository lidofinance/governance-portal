import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';

export const VetoSignallingAdditionalSupportInfo = () => {
  const { detailedState, amountTillNextPhasePercent } =
    useDualGovernanceContext();

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

  if (amountTillNextPhasePercent <= 0) {
    return (
      <Text color="secondary">
        RageQuit starts on <Text as="b">{vetoSignallingEndDate?.date}</Text>{' '}
        {vetoSignallingEndDate?.timezone} if stETH support stays above the
        threshold. Otherwise, Deactivation starts.
      </Text>
    );
  }

  return (
    <Text color="secondary">
      RageQuit starts if{' '}
      {amountTillNextPhasePercent && (
        <Text as="b">
          {Math.round(amountTillNextPhasePercent * 100) / 100}%
        </Text>
      )}{' '}
      more {Token.stETH} is added till{' '}
      <Text as="b">{vetoSignallingEndDate?.date}</Text>{' '}
      {vetoSignallingEndDate?.timezone}
    </Text>
  );
};
