import { FC } from 'react';
import { ProposalsGridList } from 'features/dual-governance/proposals/proposals-grid-list/proposals-grid-list';

import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Index: FC = () => {
  return (
    <Layout containerSize="full">
      <ProposalsGridList />
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps(async () => {
  return { props: {} };
});

export default Index;
