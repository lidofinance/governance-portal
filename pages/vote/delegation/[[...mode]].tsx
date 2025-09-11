import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import {
  DelegationTabs,
  DelegationTabsLayoutProps,
} from 'features/vote/components/delegation-tabs';
import { Layout } from 'shared/components';

const DelegationPage: FC<DelegationTabsLayoutProps> = ({ mode }) => {
  return (
    <Layout containerSize="full">
      <DelegationTabs mode={mode} />
    </Layout>
  );
};

export default DelegationPage;

type DelegationModePageParams = {
  mode: ['delegators'] | ['customize'] | undefined;
};

export const getStaticPaths: GetStaticPaths<DelegationModePageParams> = () => {
  return {
    paths: [
      { params: { mode: undefined } },
      { params: { mode: ['customize'] } },
      { params: { mode: ['delegators'] } },
    ],
    fallback: false, // return 404 on non match
  };
};

// we need [[...]] pattern for / and /unwrap
export const getStaticProps: GetStaticProps<
  DelegationTabsLayoutProps,
  DelegationModePageParams
> = ({ params }) => {
  const mode = params?.mode;
  if (!mode) return { props: { mode: 'delegation' }, revalidate: 60 };

  return { props: { mode: mode[0] }, revalidate: 60 };
};
