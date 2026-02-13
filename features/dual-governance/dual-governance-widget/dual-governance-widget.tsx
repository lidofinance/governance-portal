import { GovernanceState, VisibleGovernanceState } from '../types';
import {
  CheckLink,
  DualGovernanceWidgetWrapper,
  Label,
  StatusBulb,
} from './style';
import { Box } from '@lidofinance/lido-ui';
import { parsePercent16 } from 'shared/blockchain/utils';
import { DualGovernanceWidgetState } from './use-dual-governance-widget-state';
import { formatBalance } from 'utils/format-balance';
import { GOVERNANCE_PATH } from 'constants/urls';

type Props = {
  dualGovernanceState: DualGovernanceWidgetState;
};

const getDualGovernanceStatusLabel = (status: VisibleGovernanceState) => {
  switch (status) {
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedRageQuit:
    case VisibleGovernanceState.BlockedDeactivation:
    case VisibleGovernanceState.Emergency:
      return 'Blocked';
    case VisibleGovernanceState.Cooldown:
      return 'Cooldown';
    default:
      return 'Normal';
  }
};

export const DualGovernanceWidget = ({ dualGovernanceState }: Props) => {
  const {
    visibleStatus,
    status,
    activeProposalsCount,
    totalStEthInEscrow,
    nextStatus,
    amountUntilVetoSignalling,
    totalSupply,
    secondSealRageQuitSupport,
  } = dualGovernanceState;

  const secondSealRageQuitSupportPercent = parsePercent16(
    BigInt(secondSealRageQuitSupport),
  );

  const calculateRQThresholdPercent = () => {
    if (
      !secondSealRageQuitSupportPercent ||
      secondSealRageQuitSupportPercent <= 0 ||
      totalStEthInEscrow < 0
    ) {
      return 0;
    }

    const targetValue =
      (totalSupply * BigInt(secondSealRageQuitSupportPercent)) / 100n;

    if (targetValue === 0n) {
      return totalStEthInEscrow > 0 ? 100 : 0;
    }

    const scaleFactor = 10000n;
    const percentBN = (totalStEthInEscrow * scaleFactor * 100n) / targetValue;

    let thresholdSupportPercent =
      Number(percentBN.toString()) / Number(scaleFactor);

    if (thresholdSupportPercent > 100) {
      thresholdSupportPercent = 100;
    }
    if (thresholdSupportPercent < 0) {
      thresholdSupportPercent = 0;
    }

    return thresholdSupportPercent;
  };

  const rageQuitThresholdPercent = calculateRQThresholdPercent();

  const formattedRageQuitThresholdPercent = rageQuitThresholdPercent.toFixed(1);

  const hasProposals = !!activeProposalsCount;
  const showProposalsInfo =
    hasProposals &&
    visibleStatus !== VisibleGovernanceState.Normal &&
    visibleStatus !== VisibleGovernanceState.Cooldown;

  const showState =
    visibleStatus === VisibleGovernanceState.BlockedVetoSignalling ||
    visibleStatus === VisibleGovernanceState.BlockedDeactivation ||
    visibleStatus === VisibleGovernanceState.BlockedRageQuit;

  const showNextState =
    status !== nextStatus &&
    (status === GovernanceState.RageQuit ||
      status === GovernanceState.VetoCooldown);

  return (
    <DualGovernanceWidgetWrapper data-testid="dgWidget">
      {/* Governance State */}
      <p>
        <Label $size={14} $weight={700}>
          Governance
        </Label>
        <Label data-testid="dgStatus">
          <StatusBulb $status={visibleStatus} data-testid="statusBulb" />
          {getDualGovernanceStatusLabel(visibleStatus)}
        </Label>
      </p>
      {showState && (
        <p>
          <Label>State</Label>
          <Label data-testid="dgState">
            {VisibleGovernanceState[visibleStatus]}
          </Label>
        </p>
      )}
      {/* Veto Support */}
      {status !== GovernanceState.RageQuit && (
        <Box display="flex" justifyContent="space-between">
          <Label>Veto Support</Label>
          <p>
            <Label $color="secondary" data-testid="vsBalance">
              {formatBalance(totalStEthInEscrow, 1)} /{' '}
              {formatBalance(totalSupply, 1)}
            </Label>
          </p>
        </Box>
      )}
      {/* RQ Support */}
      {status === GovernanceState.VetoSignalling && (
        <Box display="flex" justifyContent="space-between">
          <Label>RageQuit threshold</Label>
          <p>
            <Label $color="secondary" data-testid="rqPercent">
              {formattedRageQuitThresholdPercent}%
            </Label>
          </p>
        </Box>
      )}
      {/* Conditional information */}
      {showNextState && (
        <p>
          <Label>Next state</Label>
          <Label data-testid="nextState">
            {VisibleGovernanceState[visibleStatus]}
          </Label>
        </p>
      )}
      {amountUntilVetoSignalling && (
        <p>
          <Label>stETH needed to Veto Signalling</Label>
          <Label>{amountUntilVetoSignalling.value}</Label>
        </p>
      )}
      {/* Proposals */}
      {showProposalsInfo && (
        <p>
          <Label $color="secondary">
            {amountUntilVetoSignalling ? (
              <>
                {activeProposalsCount} proposal
                {activeProposalsCount > 1 ? 's' : ''}{' '}
                {activeProposalsCount > 1 ? 'are ' : 'is '}currently blocked in
                Dual Governance will remain so only if
                {amountUntilVetoSignalling.value} stETH (
                {amountUntilVetoSignalling.percentage}%) is added
              </>
            ) : (
              <>
                {activeProposalsCount} pending proposal
                {activeProposalsCount > 1 ? 's' : ''} in Dual Governance
              </>
            )}
          </Label>
        </p>
      )}
      <CheckLink
        href={GOVERNANCE_PATH}
        target="_blank"
        rel="noreferrer"
        data-testid="dgRedirectBtn"
      >
        Go to Dual Governance
      </CheckLink>
    </DualGovernanceWidgetWrapper>
  );
};
