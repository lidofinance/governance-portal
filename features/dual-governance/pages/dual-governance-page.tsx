import Head from 'next/head';
import { FormSection } from 'features/dual-governance/form-section';
import { Layout } from 'shared/components';
import { ProposalsSection } from 'features/dual-governance/proposals/proposals-section';

export const DualGovernancePage = () => {
  return (
    <Layout containerSize="full">
      <Head>
        <title>Dual Governance | Lido</title>
      </Head>
      <FormSection />
      <ProposalsSection />
    </Layout>
  );
};
