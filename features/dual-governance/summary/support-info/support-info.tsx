import { Text } from 'shared/components/text';
import { AdditionalSupportInfo } from './additional-support-info';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { ProgressBar } from 'shared/components/progress-bar';
import { parsePercent16 } from 'shared/blockchain/utils';
import { RageQuitProgress } from './rage-quit-progress';

const InlineLoaderStyled = styled(InlineLoader)`
  margin-top: 20px;
  height: 50px;
  width: 100%;
`;

export const SupportInfo = () => {
  const {
    rageQuitSupport,
    totalStEthInEscrow,
    visibleState,
    nextPhaseSupportThresholdPercent,
  } = useDualGovernanceContext();

  const nextStateTitle =
    visibleState === VisibleGovernanceState.BlockedDeactivation ||
    visibleState === VisibleGovernanceState.BlockedVetoSignalling
      ? 'RageQuit'
      : 'VetoSignalling';

  return (
    <div>
      <Text size={22} weight={300} color="secondary">
        stETH veto support
      </Text>
      {visibleState === VisibleGovernanceState.Loading ? (
        <InlineLoaderStyled />
      ) : (
        <>
          <Text size={22} weight={600}>
            {totalStEthInEscrow} stETH
          </Text>
          <ProgressBar
            variant="danger"
            progressPercent={parsePercent16(rageQuitSupport)}
            totalPercent={nextPhaseSupportThresholdPercent}
            totalTitle={`${nextStateTitle} Threshold`}
          />
        </>
      )}
      <AdditionalSupportInfo />
      {visibleState === VisibleGovernanceState.BlockedRageQuit && (
        <RageQuitProgress />
      )}
    </div>
  );
};
