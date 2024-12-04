import Head from 'next/head';
import { Layout } from 'shared/components';
import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';
import { DualGovernanceSummary } from '../summary';
import { DualGovernanceControlPanel } from '../control-panel';
import { ProposalsSection } from '../proposals/proposals-section';

const DashboardWrapper = styled(Block)`
  border: 1px solid var(--custom-border);
  background: none;
  padding: 0;
  border-radius: 60px;
  display: flex;
  min-height: 530px;
`;

export const DualGovernancePage = () => {
  return (
    <Layout containerSize="full">
      <Head>
        <title>Dual Governance | Lido</title>
      </Head>
      <DashboardWrapper>
        <DualGovernanceSummary />
        <DualGovernanceControlPanel />
      </DashboardWrapper>
      <ProposalsSection />
    </Layout>
  );
};
