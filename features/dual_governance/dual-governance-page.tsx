import { Layout } from '../../shared/components';
import Head from 'next/head';
import { DualGovernance } from './dual-governance';

export const DualGovernancePage = () => {
  return (
    <Layout containerSize="full">
      <Head>
        <title>Dual Governance | Lido</title>
      </Head>
      <DualGovernance />
    </Layout>
  );
};
