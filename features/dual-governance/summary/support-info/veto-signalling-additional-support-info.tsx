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
