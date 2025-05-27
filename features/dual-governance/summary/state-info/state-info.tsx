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
import { FlexWrapper } from 'shared/styled-components';
import { getNextGovernanceState } from '../../utils/get-next-dg-state';
import { calculateCurrentThresholdProgress } from '../../utils/calculate-current-threshold-progress';
import { useMemo } from 'react';
import { Link } from '@lidofinance/lido-ui';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { Box } from 'shared/components/box';

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
    case VisibleGovernanceState.Unset:
      return 'Unset';
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

  const { chainId } = useLidoSDK();
  const isSupportedChain = useIsSupportedChain();
  const emergencyProtectedTimelockContract = useReadContract(
    EmergencyProtectedTimelock,
  );
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

  const {
    data: emergencyProtectionDetails,
    isLoading: isLoadingEmergencyDetails,
  } = useQuery({
    queryKey: ['emergencyProtectionDetails', chainId],
    staleTime: 60 * 1000,
    enabled:
      isSupportedChain &&
      !!emergencyProtectedTimelockContract &&
      visibleState === VisibleGovernanceState.Emergency,
    queryFn: async () => {
      try {
        const result = await emergencyProtectedTimelockContract.readContract(
          'getEmergencyProtectionDetails',
        );

        if (!result) return null;

        return {
          emergencyModeDuration: Number(result.emergencyModeDuration || 0),
          emergencyModeEndsAfter: Number(result.emergencyModeEndsAfter || 0),
          emergencyProtectionEndsAfter: Number(
            result.emergencyProtectionEndsAfter || 0,
          ),
        };
      } catch (error) {
        console.error('Error fetching emergency protection details:', error);
        return null;
      }
    },
  });

  const emergencyModeEndTime = useMemo(() => {
    if (!emergencyProtectionDetails?.emergencyModeEndsAfter) return null;

    const timestamp = emergencyProtectionDetails.emergencyModeEndsAfter;
    const date = getDateFromTimestamp({
      timestamp,
      showYear: true,
    });

    return `${date.date} ${date.tz}`;
  }, [emergencyProtectionDetails]);

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
        {visibleState === VisibleGovernanceState.Emergency && (
          <Box marginTop={15}>
            {isLoadingEmergencyDetails ? (
              <Text size={16} color="secondary">
                Loading emergency mode end time...
              </Text>
            ) : emergencyModeEndTime ? (
              <Text size={16} color="default">
                ends on <b>{emergencyModeEndTime}</b>
              </Text>
            ) : null}
          </Box>
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
        <>
          <Text size={22} weight={300}>
            <Link href="#">Emergency Committee</Link> can reset Dual Governance
            and execute scheduled proposals
          </Text>
        </>
      )}
    </>
  );
};
