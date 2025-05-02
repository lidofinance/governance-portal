import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import {
  formatEth,
  formatNumber,
  parsePercent16,
} from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';
import { DGTooltip } from 'features/dual-governance/tooltips';

type Props = {
  amountTillRQPhaseWei: bigint;
};

export const DeactivationAdditionalSupportInfo = ({
  amountTillRQPhaseWei,
}: Props) => {
  const { data: dgConfig, isLoading } = useDualGovernanceConfig();
  const { detailedState } = useDualGovernanceContext();

  const amountUntilVetoSignalling = useMemo(() => {
    if (!detailedState || !dgConfig) return;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const { persistedStateEnteredAt } = detailedState;
    const {
      firstSealRageQuitSupport,
      secondSealRageQuitSupport,
      vetoSignallingMinDuration,
      vetoSignallingMaxDuration,
    } = dgConfig;

    const timestampDiff =
      currentTimestamp - persistedStateEnteredAt - vetoSignallingMinDuration;

    if (timestampDiff < 0) {
      // edge case
      return null;
    }

    // We use this timestamp to add a hardcoded gap of 3 hours to the approximate VetoSignalling restart date
    const futureTimestamp = currentTimestamp + 3 * 3600;

    const firstThreshold = parsePercent16(firstSealRageQuitSupport);
    const secondThreshold = parsePercent16(secondSealRageQuitSupport);

    const thresholdDiff = secondThreshold - firstThreshold;
    const durationDiff = vetoSignallingMaxDuration - vetoSignallingMinDuration;

    const result =
      (thresholdDiff *
        (currentTimestamp + futureTimestamp + persistedStateEnteredAt)) /
      durationDiff;

    if (result > secondThreshold || result < 0) {
      // edge case
      return null;
    }

    return formatNumber({ value: result, maxFractionDigits: 2 });
  }, [detailedState, dgConfig]);

  const restartDate = useMemo(() => {
    if (!dgConfig || !detailedState) return;

    const { vetoSignallingDeactivationMaxDuration } = dgConfig;
    const { persistedStateEnteredAt } = detailedState;
    const date = fromUnixTime(
      persistedStateEnteredAt + vetoSignallingDeactivationMaxDuration,
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
        RageQuit <DGTooltip topic="rageQuit" /> starts if{' '}
        {formatEth(amountTillRQPhaseWei, 2)} more {Token.stETH} is added by{' '}
        {restartDate?.date} {restartDate?.timezone}. If not, Cooldown{' '}
        <DGTooltip topic="cooldown" /> begins, and proposals can be scheduled
      </Text>
    );
  }

  return (
    <Text color="secondary">
      If {formatEth(amountTillRQPhaseWei, 2)} more {Token.stETH} added by
      {restartDate?.date} {restartDate?.timezone} VetoSignaling{' '}
      <DGTooltip topic="cooldown" /> restarts. If not, Cooldown{' '}
      <DGTooltip topic="cooldown" /> begins, and proposals can be scheduled
    </Text>
  );
};
