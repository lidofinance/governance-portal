import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DGTooltip } from '../../tooltips';
import { formatEth } from 'shared/blockchain/utils';

type Props = {
  amountTillRQPhaseWei: bigint;
};

export const VetoSignallingAdditionalSupportInfo = ({
  amountTillRQPhaseWei,
}: Props) => {
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

  if (amountTillNextPhasePercent <= 0) {
    return (
      <Text color="secondary">
        RageQuit <DGTooltip topic="rageQuit" /> starts on{' '}
        <b>
          {vetoSignallingEndDate?.date} {vetoSignallingEndDate?.timezone}
        </b>
        , unless veto stETH support decreases below{' '}
        <b>{nextPhaseSupportThresholdPercent}%</b>
      </Text>
    );
  }

  return (
    <Text color="secondary">
      RageQuit <DGTooltip topic="rageQuit" /> starts if{' '}
      <b>
        {formatEth(amountTillRQPhaseWei, 2)} {Token.stETH}
      </b>{' '}
      is added by{' '}
      <b>
        {vetoSignallingEndDate?.date} {vetoSignallingEndDate?.timezone}
      </b>
      ; Otherwise, Deactivation begins
    </Text>
  );
};
