import Head from 'next/head';
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
import { config } from 'config';

export const DualGovernancePage = () => {
  const { visibleState } = useDualGovernanceStateContext();

  const metaTitle = 'Dual Governance | Lido';
  const metaDescription =
    'Lido Dual Governance uses a Dynamic Timelock so stETH holders can delay execution until withdrawal—enhancing protocol safety and stETH oversight.';
  const metaPreviewImgUrl = config.ipfsMode
    ? 'https://dg.lido.fi/dg-preview.png'
    : `${(config as any).selfOrigin}/dg-preview.png`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaPreviewImgUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image:src" content={metaPreviewImgUrl} />
        <meta name="twitter:site" content="@lidofinance" />
        <meta name="description" content={metaDescription} />
      </Head>
      <Layout containerSize="full" metaTitle="Dual Governance">
        <DualGovernanceProposalsProvider>
          {visibleState !== VisibleGovernanceState.Loading && (
            <BackgroundGradient
              state={visibleState}
              width={1700}
              height={800}
            />
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
    </>
  );
};
