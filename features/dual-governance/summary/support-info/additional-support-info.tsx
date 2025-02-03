import { VisibleGovernanceState } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DeactivationAdditionalSupportInfo } from './deactivation-additional-support-info';
import { VetoSignallingAdditionalSupportInfo } from './veto-signalling-additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { CooldownAdditionalSupportInfo } from './cooldown-additional-support-info';
import { DGTooltip } from '../../tooltips';

export const AdditionalSupportInfo = () => {
  const {
    visibleState,
    amountTillNextPhasePercent,
    nextPhaseSupportThresholdPercent,
  } = useDualGovernanceContext();

  if (visibleState === VisibleGovernanceState.Loading) {
    return null;
  }

  if (visibleState === VisibleGovernanceState.BlockedVetoSignalling) {
    return <VetoSignallingAdditionalSupportInfo />;
  }

  if (visibleState === VisibleGovernanceState.BlockedDeactivation) {
    return <DeactivationAdditionalSupportInfo />;
  }

  if (visibleState === VisibleGovernanceState.Cooldown) {
    return <CooldownAdditionalSupportInfo />;
  }

  if (visibleState === VisibleGovernanceState.BlockedRageQuit) {
    if (amountTillNextPhasePercent && amountTillNextPhasePercent > 0) {
      return (
        <Text color="secondary">
          <b>VetoSignalling</b> <DGTooltip topic="vetoSignalling" /> starts
          after RageQuit if <Text as="b">{amountTillNextPhasePercent}%</Text>{' '}
          more {Token.stETH} is added; <b>Otherwise, Cooldown</b> begins
        </Text>
      );
    }

    if (amountTillNextPhasePercent && amountTillNextPhasePercent <= 0) {
      return (
        <Text color="secondary">
          <b>VetoSignalling</b> <DGTooltip topic="vetoSignalling" /> starts
          after RageQuit unless stETH support decreases below{' '}
          <Text as="b">{nextPhaseSupportThresholdPercent}%</Text>;{' '}
          <b>Otherwise, Cooldown</b> begins
        </Text>
      );
    }
  }

  // VisibleGovernanceState.Normal
  // VisibleGovernanceState.Warning
  // VisibleGovernanceState.BlockedRageQuit
  return (
    <Text color="secondary">
      <b>VetoSignalling</b> <DGTooltip topic="vetoSignalling" /> starts if{' '}
      <Text as="b">{amountTillNextPhasePercent}%</Text> more {Token.stETH} is
      added
    </Text>
  );
};
