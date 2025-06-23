import { format, fromUnixTime } from 'date-fns';
import { useDualGovernanceConfig } from 'features/dual-governance/hooks/use-dual-governance-config';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEscrowContext } from 'providers/escrow';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DGTooltip } from '../../tooltips';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import { useThresholdValue } from 'features/dual-governance/hooks';
import { GovernanceState } from '../../types';

type Props = {
  amountTillVSPhaseWei: bigint;
};

export const CooldownAdditionalSupportInfo = ({
  amountTillVSPhaseWei,
}: Props) => {
  const { data: dgConfig, isLoading } = useDualGovernanceConfig();
  const { stEthTotalSupply, rageQuitSupport } = useEscrowContext();
  const { detailedState } = useDualGovernanceStateContext();

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

  const firstSealThresholdWei = useThresholdValue(
    parsePercent16(dgConfig?.firstSealRageQuitSupport),
    stEthTotalSupply,
  );

  const cooldownEndDate = useMemo(() => {
    if (!dgConfig || !detailedState) return;

    const { vetoCooldownDuration } = dgConfig;
    const { persistedStateEnteredAt } = detailedState;
    const date = fromUnixTime(persistedStateEnteredAt + vetoCooldownDuration);

    return {
      date: format(date, 'MMM d, h:mm a'),
      timezone: format(date, 'zzz'),
    };
  }, [detailedState, dgConfig]);

  if (
    isLoading ||
    amountTillNextPhasePercent === undefined ||
    parsePercent16(dgConfig?.firstSealRageQuitSupport) === 0
  ) {
    return null;
  }

  if (amountTillVSPhaseWei < 0) {
    return (
      <Text color="secondary">
        VetoSignalling <DGTooltip topic="vetoSignalling" /> starts on{' '}
        <b>{cooldownEndDate?.date}</b> {cooldownEndDate?.timezone} unless stETH
        support decreases below{' '}
        <b>
          {firstSealThresholdWei
            ? `${formatEth(firstSealThresholdWei, 2)} ${Token.stETH}`
            : `${parsePercent16(dgConfig?.firstSealRageQuitSupport)}%`}
        </b>
      </Text>
    );
  }

  return (
    <Text color="secondary">
      VetoSignalling <DGTooltip topic="vetoSignalling" /> starts if{' '}
      <b>
        {formatEth(amountTillVSPhaseWei, 2)} {Token.stETH}
      </b>{' '}
      is added; Otherwise, Normal begins on <b>{cooldownEndDate?.date}</b>
    </Text>
  );
};
