import { BackgroundGradient, Layout } from 'shared/components';
import { Link } from '@lidofinance/lido-ui';
import { DualGovernanceSummary } from '../summary';
import { DualGovernanceControlPanel } from '../control-panel';
import { ProposalsSection } from '../proposals/proposals-section';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { VisibleGovernanceState } from '../types';
import { DualGovernanceProposalsProvider } from 'providers/dual-governance-proposals';
import { Text } from 'shared/components/text';
import { Box } from 'shared/components/box';
import { DashboardWrapper } from './style';

export const DualGovernancePage = () => {
  const { visibleState } = useDualGovernanceStateContext();

  return (
    <Layout containerSize="full" metaTitle="Dual Governance">
      <DualGovernanceProposalsProvider>
        {visibleState !== VisibleGovernanceState.Loading && (
          <BackgroundGradient state={visibleState} width={1700} height={800} />
        )}
        {visibleState === VisibleGovernanceState.Unset && (
          <Box
            borderBottom="1px solid var(--custom-border);"
            borderTop="1px solid var(--custom-border);"
            padding="3rem 0"
          >
            <Text size={32}>
              Dual Governance is <b>Unset</b>
            </Text>
            <Text>
              <Link href="#">Emergency Committee</Link> reset governance
            </Text>
          </Box>
        )}
        {visibleState !== VisibleGovernanceState.Unset && (
          <DashboardWrapper>
            <DualGovernanceSummary />
            <DualGovernanceControlPanel />
          </DashboardWrapper>
        )}
        <ProposalsSection />
      </DualGovernanceProposalsProvider>
    </Layout>
  );
};
