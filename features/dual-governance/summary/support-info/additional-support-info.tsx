import {
  GovernanceState,
  VisibleGovernanceState,
} from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DeactivationAdditionalSupportInfo } from './deactivation-additional-support-info';
import { VetoSignallingAdditionalSupportInfo } from './veto-signalling-additional-support-info';
import { CooldownAdditionalSupportInfo } from './cooldown-additional-support-info';
import { DGTooltip } from '../../tooltips';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import { useThresholdValue } from 'features/dual-governance/hooks';
import { useDualGovernanceConfig } from '../../hooks/use-dual-governance-config';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useMemo } from 'react';

type Props = {
  amountTillVSPhaseWei: bigint;
  amountTillRQPhaseWei: bigint;
};

export const AdditionalSupportInfo = ({
  amountTillVSPhaseWei,
  amountTillRQPhaseWei,
}: Props) => {
  const { data: dgConfig } = useDualGovernanceConfig();

  const { stEthTotalSupply, rageQuitSupport } = useEscrowContext();
  const { visibleState, detailedState } = useDualGovernanceStateContext();

  const firstSealRageQuitSupport = parsePercent16(
    dgConfig?.firstSealRageQuitSupport,
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
  const nextPhaseSupportThresholdPercent = parsePercent16(nextPhaseThreshold);

  const firstSealThresholdWei = useThresholdValue(
    firstSealRageQuitSupport,
    stEthTotalSupply,
  );

  if (visibleState === VisibleGovernanceState.Loading) {
    return null;
  }

  if (visibleState === VisibleGovernanceState.BlockedVetoSignalling) {
    return (
      <VetoSignallingAdditionalSupportInfo
        amountTillRQPhaseWei={amountTillRQPhaseWei}
      />
    );
  }

  if (visibleState === VisibleGovernanceState.BlockedDeactivation) {
    return (
      <DeactivationAdditionalSupportInfo
        amountTillRQPhaseWei={amountTillRQPhaseWei}
      />
    );
  }

  if (visibleState === VisibleGovernanceState.Cooldown) {
    return (
      <CooldownAdditionalSupportInfo
        amountTillVSPhaseWei={amountTillVSPhaseWei}
      />
    );
  }

  if (visibleState === VisibleGovernanceState.BlockedRageQuit) {
    // If amountTillNextPhasePercent is negative, it means we've exceeded the threshold
    // and need to decrease support to go back
    const isExceedingThreshold =
      amountTillNextPhasePercent && amountTillNextPhasePercent < 0;

    if (isExceedingThreshold) {
      return (
        <Text color="secondary">
          VetoSignalling <DGTooltip topic="vetoSignalling" /> starts after
          RageQuit unless stETH support decreases below{' '}
          <b>
            {firstSealThresholdWei
              ? `${formatEth(firstSealThresholdWei, 2)} ${Token.stETH}`
              : `${firstSealRageQuitSupport}%`}
          </b>
          ; Otherwise, Cooldown begins
        </Text>
      );
    } else if (amountTillVSPhaseWei) {
      // If we need to add more support
      return (
        <Text color="secondary">
          VetoSignalling <DGTooltip topic="vetoSignalling" /> starts after
          RageQuit if{' '}
          <b>
            {formatEth(amountTillVSPhaseWei, 2)} {Token.stETH}
          </b>{' '}
          is added; Otherwise, Cooldown begins
        </Text>
      );
    }
  }

  // VisibleGovernanceState.Normal
  // VisibleGovernanceState.Warning
  // VisibleGovernanceState.BlockedRageQuit
  if (!nextPhaseSupportThresholdPercent) {
    return;
  }
  return (
    <Text color="secondary">
      VetoSignalling <DGTooltip topic="vetoSignalling" /> starts if{' '}
      <b>
        {formatEth(amountTillVSPhaseWei, 2)} {Token.stETH}
      </b>{' '}
      is added
    </Text>
  );
};
