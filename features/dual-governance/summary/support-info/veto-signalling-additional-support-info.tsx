import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEscrowContext } from 'providers/escrow';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DGTooltip } from '../../tooltips';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import { useThresholdValue } from 'features/dual-governance/hooks';
import { useDualGovernanceConfig } from '../../hooks/use-dual-governance-config';
import { GovernanceState } from '../../types';

type Props = {
  amountTillRQPhaseWei: bigint;
};

export const VetoSignallingAdditionalSupportInfo = ({
  amountTillRQPhaseWei,
}: Props) => {
  const { stEthTotalSupply, rageQuitSupport } = useEscrowContext();
  const { detailedState } = useDualGovernanceStateContext();
  const { data: dgConfig } = useDualGovernanceConfig();
  const secondSealRageQuitSupport = parsePercent16(
    dgConfig?.secondSealRageQuitSupport,
  );

  const secondSealThresholdWei = useThresholdValue(
    secondSealRageQuitSupport,
    stEthTotalSupply,
  );

  const nextPhaseThreshold = useMemo(() => {
    return detailedState.persistedState === GovernanceState.VetoSignalling ||
      detailedState.persistedState ===
        GovernanceState.VetoSignallingDeactivation
      ? dgConfig?.secondSealRageQuitSupport
      : dgConfig?.firstSealRageQuitSupport;
  }, [detailedState.persistedState, dgConfig]);

  const amountTillNextPhase = nextPhaseThreshold
    ? nextPhaseThreshold - rageQuitSupport
    : undefined;

  const amountTillNextPhasePercent = parsePercent16(amountTillNextPhase);

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

  if (!amountTillNextPhasePercent) {
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
        <b>
          {secondSealThresholdWei
            ? `${formatEth(secondSealThresholdWei, 2)} ${Token.stETH}`
            : `${secondSealRageQuitSupport}%`}
        </b>
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
