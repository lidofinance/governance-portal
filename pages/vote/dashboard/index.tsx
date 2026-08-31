import { DashboardGrid } from '@vote/components/dashboard-grid';
import { Layout } from 'shared/components';
import { VoteMeta } from '@vote/meta';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';

const DashboardPage = () => {
  return (
    <>
      <VoteMeta />
      <Layout containerSize="full" containerPaddingX={60}>
        <DashboardGrid />
      </Layout>
    </>
  );
};

export const getStaticProps = getDefaultStaticProps();

export default DashboardPage;
