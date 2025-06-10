import Head from 'next/head';
import { BackgroundGradient, Layout } from 'shared/components';
import styled from 'styled-components';
import { Block, Link } from '@lidofinance/lido-ui';
import { DualGovernanceSummary } from '../summary';
import { DualGovernanceControlPanel } from '../control-panel';
import { ProposalsSection } from '../proposals/proposals-section';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { VisibleGovernanceState } from '../types';
import { DualGovernanceProposalsProvider } from 'providers/dual-governance-proposals';
import { devicesHeaderMedia } from 'styles/global';
import { Text } from 'shared/components/text';
import { Box } from 'shared/components/box';

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

const WarningReleaseBanner = styled.div`
  background: rgba(255, 142, 118, 0.8);
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 16px;
  color: white;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DualGovernancePage = () => {
  const { visibleState } = useDualGovernanceStateContext();

  return (
    <Layout containerSize="full">
      <DualGovernanceProposalsProvider>
        <Head>
          <title>Dual Governance | Lido</title>
        </Head>
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
        <WarningReleaseBanner>
          <Box display="flex" gap={20} alignItems="center">
            <Text size={24}>⚠️</Text>
            <p>
              This interface is not yet connected to the Lido Protocol.
              <br />
              Aragon deployment is planned in June — once live, this app will
              serve as the UI interface for Dual Governance.
            </p>
          </Box>
          <Box marginLeft="44px">
            Stay tuned:{' '}
            <a
              style={{
                color: 'white',
                textDecoration: 'underline',
              }}
              href="https://research.lido.fi/t/lip-28-dual-governance/10032/12"
              target="_blank"
              rel="noreferrer"
            >
              https://research.lido.fi/t/lip-28-dual-governance/10032/12
            </a>
          </Box>
        </WarningReleaseBanner>
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
