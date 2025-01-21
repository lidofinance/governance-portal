import Head from 'next/head';
import { BackgroundGradient, Layout } from 'shared/components';
import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { DualGovernanceSummary } from '../summary';
import { DualGovernanceControlPanel } from '../control-panel';
import { ProposalsSection } from '../proposals/proposals-section';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VisibleGovernanceState } from '../types';
import { DualGovernanceProposalsProvider } from 'providers/dual-governance-proposals';
import { devicesHeaderMedia } from 'styles/global';

const DashboardWrapper = styled(Block)`
  border: 1px solid var(--custom-border);
  background: none;
  padding: 0;
  border-radius: 60px;
  display: flex;
  min-height: 530px;

  @media ${devicesHeaderMedia.tablet} {
    flex-direction: column;
  }
`;

export const DualGovernancePage = () => {
  const { visibleState } = useDualGovernanceContext();

  return (
    <Layout containerSize="full">
      <DualGovernanceProposalsProvider>
        <Head>
          <title>Dual Governance | Lido</title>
        </Head>
        {visibleState !== VisibleGovernanceState.Loading && (
          <BackgroundGradient state={visibleState} width={1700} height={800} />
        )}
        <DashboardWrapper>
          <DualGovernanceSummary />
          <DualGovernanceControlPanel />
        </DashboardWrapper>
        <ProposalsSection />
      </DualGovernanceProposalsProvider>
    </Layout>
  );
};
