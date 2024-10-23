// import { config } from 'config';

import { FC } from 'react';
import { ProposalsPaginatedList } from 'features/dual-governance/proposals/proposals-paginated-list/proposals-paginated-list';

import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const Settings: FC = () => {
  return (
    <Layout containerSize="full">
      <ProposalsPaginatedList />
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps(async () => {
  return { props: {} };
});

export default Settings;
