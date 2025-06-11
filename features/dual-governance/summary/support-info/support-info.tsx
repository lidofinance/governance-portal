import { Text } from 'shared/components/text';
import { AdditionalSupportInfo } from './additional-support-info';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { ProgressBar } from 'shared/components/progress-bar';
import { RageQuitProgress } from './rage-quit-progress';
import { DGTooltip } from 'features/dual-governance/tooltips';
import { FlexWrapper } from 'shared/styled-components';
import { calculateCurrentThresholdProgress } from '../../utils/calculate-current-threshold-progress';
import { useMemo } from 'react';
import { useEscrowContext } from 'providers/escrow';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import { useDualGovernanceConfig } from '../../hooks/use-dual-governance-config';
import { useEscrowBalances } from '../../hooks/use-escrow-balances';

const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 20px;
  height: 50px;
  width: 100%;
`;

export const SupportInfo = () => {
  const { stEthTotalSupply } = useEscrowContext();

  const { data: escrowBalances } = useEscrowBalances();

  const { data: dgConfig } = useDualGovernanceConfig();
  const firstSealRageQuitSupport = parsePercent16(
    dgConfig?.firstSealRageQuitSupport,
  );
  const secondSealRageQuitSupport = parsePercent16(
    dgConfig?.secondSealRageQuitSupport,
  );

  const { visibleState } = useDualGovernanceStateContext();

  const nextStateTitle =
    visibleState === VisibleGovernanceState.BlockedDeactivation ||
    visibleState === VisibleGovernanceState.BlockedVetoSignalling
      ? 'RageQuit'
      : 'VetoSignalling';

  const vetoSignallingThresholdProgress = useMemo(() => {
    if (
      escrowBalances?.totalLockedSharesInEscrows === undefined ||
      stEthTotalSupply === undefined ||
      firstSealRageQuitSupport === undefined
    ) {
      return null;
    }

    return calculateCurrentThresholdProgress({
      targetPercent: firstSealRageQuitSupport,
      currentSupport: escrowBalances.totalLockedSharesInEscrows,
      stEthTotalSupply,
    });
  }, [escrowBalances, stEthTotalSupply, firstSealRageQuitSupport]);

  const rageQuitThresholdProgress = useMemo(() => {
    if (
      escrowBalances?.totalLockedSharesInEscrows === undefined ||
      stEthTotalSupply === undefined ||
      secondSealRageQuitSupport === undefined
    ) {
      return null;
    }

    return calculateCurrentThresholdProgress({
      targetPercent: secondSealRageQuitSupport,
      currentSupport: escrowBalances.totalLockedSharesInEscrows,
      stEthTotalSupply,
    });
  }, [escrowBalances, stEthTotalSupply, secondSealRageQuitSupport]);

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
            {formatEth(escrowBalances?.totalLockedSharesInEscrows || 0n)} stETH
          </Text>

          {stEthTotalSupply && firstSealRageQuitSupport && (
            <ProgressBar
              variant={
                visibleState === VisibleGovernanceState.Normal
                  ? 'default'
                  : 'danger'
              }
              progressPercent={Number(
                currentThreshold?.thresholdSupportPercent || 0,
              )}
              totalPercent={Number(currentThreshold?.targetValue || 100)}
              totalTitle={`${nextStateTitle} Threshold`}
            />
          )}
        </>
      )}

      {escrowBalances?.totalLockedSharesInEscrows !== undefined &&
        vetoSignallingThresholdProgress &&
        rageQuitThresholdProgress && (
          <AdditionalSupportInfo
            amountTillVSPhaseWei={
              vetoSignallingThresholdProgress.targetValue -
              escrowBalances.totalLockedSharesInEscrows
            }
            amountTillRQPhaseWei={
              rageQuitThresholdProgress.targetValue -
              escrowBalances.totalLockedSharesInEscrows
            }
          />
        )}
      {visibleState === VisibleGovernanceState.BlockedRageQuit && (
        <RageQuitProgress />
      )}
    </div>
  );
};
