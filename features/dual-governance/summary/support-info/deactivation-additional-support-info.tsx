import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { parsePercent16 } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';

export const DeactivationAdditionalSupportInfo = () => {
  const { data: dgConfig, isLoading } = useDualGovernanceConfig();
  const { detailedState, amountTillNextPhasePercent } =
    useDualGovernanceContext();

  const amountUntilVetoSignalling = useMemo(() => {
    if (!detailedState || !dgConfig) return;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const { vetoSignallingActivatedAt } = detailedState;
    const {
      firstSealRageQuitSupport,
      secondSealRageQuitSupport,
      vetoSignallingMinDuration,
      vetoSignallingMaxDuration,
    } = dgConfig;

    const timestampDiff =
      currentTimestamp - vetoSignallingActivatedAt - vetoSignallingMinDuration;

    if (timestampDiff < 0) {
      // edge case
      return null;
    }

    const firstThreshold = parsePercent16(firstSealRageQuitSupport);
    const secondThreshold = parsePercent16(secondSealRageQuitSupport);

    const thresholdDiff = secondThreshold - firstThreshold;
    const durationDiff = vetoSignallingMaxDuration - vetoSignallingMinDuration;

    const result =
      firstThreshold + (timestampDiff * thresholdDiff) / durationDiff;

    if (result > secondThreshold || result < 0) {
      // edge case
      return null;
    }

    return result;
  }, [detailedState, dgConfig]);

  const restartDate = useMemo(() => {
    if (!dgConfig || !detailedState) return;

    const { vetoSignallingDeactivationMaxDuration } = dgConfig;
    const { vetoSignallingActivatedAt } = detailedState;
    const date = fromUnixTime(
      vetoSignallingActivatedAt + vetoSignallingDeactivationMaxDuration,
    );

    return {
      date: format(date, 'MMM d, h:mm a'),
      timezone: format(date, 'zzz'),
    };
  }, [detailedState, dgConfig]);

  if (isLoading) {
    return null;
  }

  if (amountUntilVetoSignalling === null) {
    return (
      <Text color="secondary">
        RageQuit starts if <Text as="b">{amountTillNextPhasePercent}%</Text>{' '}
        more {Token.stETH} is added
      </Text>
    );
  }

  return (
    <Text color="secondary">
      If <Text as="b">{amountUntilVetoSignalling}%</Text> more {Token.stETH}{' '}
      added by <Text as="b">{restartDate?.date}</Text> {restartDate?.timezone}{' '}
      VetoSignaling restarts. If not, Cooldown begins, and proposals can be
      executed
    </Text>
  );
};
