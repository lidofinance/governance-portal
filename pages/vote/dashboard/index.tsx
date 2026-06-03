import { DashboardGrid } from '@vote/components/dashboard-grid';
import { Layout } from 'shared/components';
import { VoteMeta } from '@vote/meta';

const DashboardPage = () => {
  return (
    <>
      <VoteMeta />
      <Layout containerSize="full">
        <DashboardGrid />
      </Layout>
    </>
  );
};

export default DashboardPage;
