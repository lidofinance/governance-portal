import { useMemo } from 'react';
import { Tooltip } from '@lidofinance/lido-ui';
import { ProgressBar } from 'shared/components/progress-bar';
import { SkeletonBar } from 'shared/components/skeleton-bar';
import { InfoIcon } from 'shared/components/icons';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceConfig } from '@dg/hooks/use-dual-governance-config';
import { calculateCurrentThresholdProgress } from '@dg/utils/calculate-current-threshold-progress';
import { parsePercent16 } from 'shared/blockchain/utils';
import { formatBalance } from 'utils/format-balance';
import {
  Wrap,
  Header,
  Title,
  Value,
  FooterRow,
  InfoIconWrap,
  ProgressWrap,
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
        <Title>
          Veto support
          <Tooltip title="Total stETH locked in the veto signalling escrow as a share of the VetoSignalling threshold. If support reaches 100%, Dual Governance enters VetoSignalling and blocks the proposal.">
            <InfoIconWrap>
              <InfoIcon />
            </InfoIconWrap>
          </Tooltip>
        </Title>
        <Value>
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
        <span>
          {isDataLoading ? (
            <SkeletonBar width={24} />
          ) : (
            formatBalance(totalStEthInEscrow, 1)
          )}
        </span>
        <span>VetoSignalling threshold</span>
      </FooterRow>
    </Wrap>
  );
};
