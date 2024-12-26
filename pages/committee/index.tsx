import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';
import { CommitteePage as CommitteePageComponent } from 'features/committee/pages/committee-page';
import { BackgroundGradient, Layout } from 'shared/components';
import Head from 'next/head';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { DualGovernanceProposalsProvider } from 'providers/dual-governance-proposals';
import { TempRedBackgroundStyle } from './temporary-red-background-style';

export const getStaticProps = getDefaultStaticProps();

const CommitteePage = () => {
  return (
    <Layout containerSize="full">
      <DualGovernanceProposalsProvider>
        <Head>
          <title>Dual Governance | Lido</title>
        </Head>
        <BackgroundGradient
          state={VisibleGovernanceState.BlockedRageQuit}
          width={1700}
          height={800}
        />
        <CommitteePageComponent />
      </DualGovernanceProposalsProvider>
      <TempRedBackgroundStyle />
    </Layout>
  );
};

export default CommitteePage;
