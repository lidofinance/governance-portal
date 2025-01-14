import { VisibleGovernanceState } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DeactivationAdditionalSupportInfo } from './deactivation-additional-support-info';
import { VetoSignallingAdditionalSupportInfo } from './veto-signalling-additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { CooldownAdditionalSupportInfo } from './cooldown-additional-support-info';
import { DGTooltip } from '../../tooltips';

export const AdditionalSupportInfo = () => {
  const { visibleState, amountTillNextPhasePercent } =
    useDualGovernanceContext();

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

  // VisibleGovernanceState.Normal
  // VisibleGovernanceState.Warning
  // VisibleGovernanceState.BlockedRageQuit
  return (
    <Text color="secondary">
      VetoSignalling <DGTooltip topic="vetoSignalling" /> starts if{' '}
      <Text as="b">{amountTillNextPhasePercent}%</Text> more {Token.stETH} is
      added
    </Text>
  );
};
