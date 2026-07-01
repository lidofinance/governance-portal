import { useMemo } from 'react';
import { Tooltip } from '@lidofinance/lido-ui';
import { ProgressBar } from 'shared/components/progress-bar';
import { SkeletonBar } from 'shared/components/skeleton-bar';
import { InfoIcon } from 'shared/components/icons';
import { useEscrowContext } from 'providers/escrow';
// eslint-disable-next-line import/no-restricted-paths
import { useDualGovernanceConfig } from '@dg/hooks/use-dual-governance-config';
import { calculateCurrentThresholdProgress } from 'shared/utils/calculate-current-threshold-progress';
import { formatEth, parsePercent16 } from 'shared/blockchain/utils';
import {
  Wrap,
  Header,
  Title,
  Value,
  FooterRow,
  ThresholdLabel,
  InfoIconWrap,
  ProgressWrap,
  TooltipText,
} from './style';

export const VoteVetoSupport = () => {
  const {
    totalStEthInEscrow,
    stEthTotalSupply,
    isLoading: isEscrowLoading,
  } = useEscrowContext();
  const { data: dgConfig, isLoading: isConfigLoading } =
    useDualGovernanceConfig();

  const firstSealRageQuitSupport = parsePercent16(
    dgConfig?.firstSealRageQuitSupport,
  );

  const { thresholdSupportPercent } = useMemo(
    () =>
      calculateCurrentThresholdProgress({
        targetPercent: firstSealRageQuitSupport,
        currentSupport: totalStEthInEscrow,
        stEthTotalSupply,
      }),
    [firstSealRageQuitSupport, totalStEthInEscrow, stEthTotalSupply],
  );

  const isDataLoading = isEscrowLoading || isConfigLoading;

  return (
    <Wrap>
      <Header>
        <Title>Veto support</Title>
        <Value data-testid="vetoSupportPercent">
          {isDataLoading ? (
            <SkeletonBar width={36} />
          ) : (
            `${thresholdSupportPercent}%`
          )}
        </Value>
      </Header>
      <ProgressWrap>
        <ProgressBar
          progressPercent={thresholdSupportPercent}
          totalPercent={100}
          variant={thresholdSupportPercent > 0 ? 'primary' : 'default'}
          showProgressInfo={false}
        />
      </ProgressWrap>
      <FooterRow>
        <span data-testid="vetoSupportValue">
          {isDataLoading ? (
            <SkeletonBar width={24} />
          ) : (
            `${formatEth(totalStEthInEscrow)} stETH`
          )}
        </span>
        <ThresholdLabel>
          VetoSignalling threshold
          <Tooltip
            title={
              <TooltipText>
                Total stETH locked in the veto signalling escrow as a share of
                the VetoSignalling threshold. If support reaches 100%, Dual
                Governance enters VetoSignalling and blocks the proposal.
              </TooltipText>
            }
          >
            <InfoIconWrap>
              <InfoIcon />
            </InfoIconWrap>
          </Tooltip>
        </ThresholdLabel>
      </FooterRow>
    </Wrap>
  );
};
