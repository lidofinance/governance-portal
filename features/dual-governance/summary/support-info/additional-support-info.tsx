import { VisibleGovernanceState } from 'features/dual-governance/types';
import { Token } from 'shared/blockchain/types';
import { Text } from 'shared/components/text';
import { DeactivationAdditionalSupportInfo } from './deactivation-additional-support-info';
import { VetoSignallingAdditionalSupportInfo } from './veto-signalling-additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { CooldownAdditionalSupportInfo } from './cooldown-additional-support-info';
import { DGTooltip } from '../../tooltips';
import { formatEth } from 'shared/blockchain/utils';

type Props = {
  amountTillVSPhaseWei: bigint;
  amountTillRQPhaseWei: bigint;
};

export const AdditionalSupportInfo = ({
  amountTillVSPhaseWei,
  amountTillRQPhaseWei,
}: Props) => {
  const {
    visibleState,
    amountTillNextPhasePercent,
    nextPhaseSupportThresholdPercent,
  } = useDualGovernanceContext();

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
    if (amountTillVSPhaseWei) {
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

    if (amountTillNextPhasePercent && amountTillNextPhasePercent <= 0) {
      return (
        <Text color="secondary">
          VetoSignalling <DGTooltip topic="vetoSignalling" /> starts after
          RageQuit unless stETH support decreases below{' '}
          <b>{nextPhaseSupportThresholdPercent}%</b>; Otherwise, Cooldown begins
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
