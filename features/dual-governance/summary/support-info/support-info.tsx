import { Text } from 'shared/components/text';
import { AdditionalSupportInfo } from './additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { ProgressBar } from 'shared/components/progress-bar';
import { RageQuitProgress } from './rage-quit-progress';
import { DGTooltip } from 'features/dual-governance/tooltips';
import { FlexWrapper } from 'shared/styled-components';
import { calculateCurrentThresholdProgress } from '../../utils/calculate-current-threshold-progress';
import { useMemo } from 'react';

const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 20px;
  height: 50px;
  width: 100%;
`;

export const SupportInfo = () => {
  const {
    totalStEthInEscrow,
    totalStEthInEscrowFormatted,
    visibleState,
    stEthTotalSupply,
    firstSealRageQuitSupport,
    secondSealRageQuitSupport,
  } = useDualGovernanceContext();

  const nextStateTitle =
    visibleState === VisibleGovernanceState.BlockedDeactivation ||
    visibleState === VisibleGovernanceState.BlockedVetoSignalling
      ? 'RageQuit'
      : 'VetoSignalling';

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

  const currentThreshold = useMemo(() => {
    return visibleState === VisibleGovernanceState.BlockedVetoSignalling ||
      visibleState === VisibleGovernanceState.BlockedDeactivation
      ? rageQuitThresholdProgress
      : vetoSignallingThresholdProgress;
  }, [
    rageQuitThresholdProgress,
    vetoSignallingThresholdProgress,
    visibleState,
  ]);

  return (
    <div>
      <FlexWrapper $alignItems="center" $justifyContent="flex-start" $gap="4px">
        <Text size={22} weight={300} color="secondary">
          stETH veto support
        </Text>
        <DGTooltip topic="vetoSupport" />
      </FlexWrapper>
      {visibleState === VisibleGovernanceState.Loading ? (
        <InlineLoaderStyled />
      ) : (
        <>
          <Text size={22} weight={600}>
            {totalStEthInEscrowFormatted} stETH
          </Text>

          {vetoSignallingThresholdProgress && (
            <ProgressBar
              variant="danger"
              progressPercent={Number(
                currentThreshold?.thresholdSupportPercent,
              )}
              totalPercent={Number(currentThreshold?.targetValue)}
              totalTitle={`${nextStateTitle} Threshold`}
            />
          )}
        </>
      )}

      {totalStEthInEscrow !== undefined &&
        vetoSignallingThresholdProgress &&
        rageQuitThresholdProgress && (
          <AdditionalSupportInfo
            amountTillVSPhaseWei={
              vetoSignallingThresholdProgress.targetValue - totalStEthInEscrow
            }
            amountTillRQPhaseWei={
              rageQuitThresholdProgress.targetValue - totalStEthInEscrow
            }
          />
        )}
      {visibleState === VisibleGovernanceState.BlockedRageQuit && (
        <RageQuitProgress />
      )}
    </div>
  );
};
