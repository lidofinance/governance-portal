import {
  GovernanceState,
  VisibleGovernanceState,
} from 'features/dual-governance/types';
import {
  StateIndicator,
  StateInfoStyled,
  StateLoader,
  StateStatus,
} from './style';
import { Text } from 'shared/components/text';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { FlexWrapper } from '../../../../shared/styled-components';
import { getNextGovernanceState } from '../../utils/get-next-dg-state';
import { calculateCurrentThresholdProgress } from '../../utils/calculate-current-threshold-progress';
import { useMemo } from 'react';
import { Link } from '@lidofinance/lido-ui';

const getStateLabel = (state: VisibleGovernanceState) => {
  switch (state) {
    case VisibleGovernanceState.Normal:
    case VisibleGovernanceState.Warning:
      return 'Normal';
    case VisibleGovernanceState.BlockedVetoSignalling:
    case VisibleGovernanceState.BlockedDeactivation:
    case VisibleGovernanceState.BlockedRageQuit:
      return 'Blocked';
    case VisibleGovernanceState.Cooldown:
      return 'Cooldown';
    case VisibleGovernanceState.Emergency:
      return 'Emergency mode';
    default:
      return null;
  }
};

const getStateSubtitle = (state: VisibleGovernanceState) => {
  switch (state) {
    case VisibleGovernanceState.BlockedDeactivation:
      return 'Deactivation';
    case VisibleGovernanceState.BlockedVetoSignalling:
      return 'VetoSignalling';
    case VisibleGovernanceState.BlockedRageQuit:
      return 'RageQuit';
    default:
      return null;
  }
};

export const StateInfo = () => {
  const {
    visibleState,
    detailedState,
    totalStEthInEscrow,
    stEthTotalSupply,
    firstSealRageQuitSupport,
    secondSealRageQuitSupport,
  } = useDualGovernanceContext();
  const subtitle = getStateSubtitle(visibleState);

  const vetoSignallingThresholdProgress = useMemo(() => {
    if (
      totalStEthInEscrow === undefined ||
      stEthTotalSupply === undefined ||
      firstSealRageQuitSupport === undefined
    ) {
      return null;
    }

    return calculateCurrentThresholdProgress({
      targetPercent: firstSealRageQuitSupport,
      currentSupport: totalStEthInEscrow,
      stEthTotalSupply,
    });
  }, [totalStEthInEscrow, stEthTotalSupply, firstSealRageQuitSupport]);

  const rageQuitThresholdProgress = useMemo(() => {
    if (
      totalStEthInEscrow === undefined ||
      stEthTotalSupply === undefined ||
      secondSealRageQuitSupport === undefined
    ) {
      return null;
    }

    return calculateCurrentThresholdProgress({
      targetPercent: secondSealRageQuitSupport,
      currentSupport: totalStEthInEscrow,
      stEthTotalSupply,
    });
  }, [totalStEthInEscrow, stEthTotalSupply, secondSealRageQuitSupport]);

  const showNextState = useMemo(() => {
    if (!vetoSignallingThresholdProgress || !rageQuitThresholdProgress) {
      return false;
    }
    const nextState = getNextGovernanceState({
      currentState: detailedState?.persistedState,
      vetoSignallingThresholdPercent:
        vetoSignallingThresholdProgress?.thresholdSupportPercent,
      rageQuitThresholdPercent:
        rageQuitThresholdProgress?.thresholdSupportPercent,
    });

    return (
      nextState &&
      detailedState &&
      [
        GovernanceState.VetoSignalling,
        GovernanceState.VetoSignallingDeactivation,
        GovernanceState.RageQuit,
      ].indexOf(detailedState.persistedState) !== -1 &&
      detailedState?.persistedState !== nextState
    );
  }, [
    detailedState,
    rageQuitThresholdProgress,
    vetoSignallingThresholdProgress,
  ]);

  const nextState = getNextGovernanceState({
    currentState: detailedState?.persistedState,
    vetoSignallingThresholdPercent:
      vetoSignallingThresholdProgress?.thresholdSupportPercent || 0,
    rageQuitThresholdPercent:
      rageQuitThresholdProgress?.thresholdSupportPercent || 0,
  });

  return (
    <>
      <StateInfoStyled>
        <Text size={22} weight={300} color="secondary">
          State
        </Text>
        {visibleState === VisibleGovernanceState.Loading ? (
          <StateLoader />
        ) : (
          <StateStatus>
            <Text size={34}>{getStateLabel(visibleState)}</Text>
            <StateIndicator $state={visibleState} />
          </StateStatus>
        )}
        {subtitle && detailedState ? (
          <FlexWrapper $gap="12px">
            <Text>{subtitle}</Text>
            {showNextState && (
              <Text color="secondary">{`Next state: ${GovernanceState[nextState || 1]}`}</Text>
            )}
          </FlexWrapper>
        ) : null}
      </StateInfoStyled>
      {visibleState === VisibleGovernanceState.Emergency && (
        <Text size={22} weight={300}>
          <Link href={'#'}>Emergency Committee</Link> can disable Dual
          Governance and execute any active proposal
        </Text>
      )}
    </>
  );
};
