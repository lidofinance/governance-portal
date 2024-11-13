import Head from 'next/head';
import { FormSection } from './form-section';
import { Layout } from 'shared/components';
// import { ProposalsSection } from './proposals-section';

export const DualGovernancePage = () => {
  return (
    <Layout containerSize="full">
      <Head>
        <title>Dual Governance | Lido</title>
      </Head>
      <FormSection />
      {/* <ProposalsSection /> */}
    </Layout>
  );
};
