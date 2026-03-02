import { getDefaultStaticProps } from 'utils-api/get-default-static-props';
import { CommitteePage as CommitteePageComponent } from 'features/committee/pages/committee-page';
import { BackgroundGradient, Layout } from 'shared/components';
import Head from 'next/head';
import { VisibleGovernanceState } from 'features/dual-governance/types';

export const getStaticProps = getDefaultStaticProps();

const CommitteePage = () => {
  return (
    <Layout containerSize="full">
      <Head>
        <title>Governance Portal | Lido</title>
      </Head>
      <BackgroundGradient
        state={VisibleGovernanceState.BlockedRageQuit}
        width={1700}
        height={800}
      />
      <CommitteePageComponent />
      {/*<TempRedBackgroundStyle />*/}
    </Layout>
  );
};

export default CommitteePage;
