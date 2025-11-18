import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { DashboardGrid } from 'features/vote/components/dashboard-grid';
import { Layout } from 'shared/components';
import { VoteMeta } from '../../../features/vote/meta';

const DashboardPage = () => {
  const router = useRouter();

  const pageNumber = useMemo(() => {
    const { page: urlPage = [] } = router.query;
    const [page] = urlPage;

    if (typeof page === 'string') {
      const parsedPage = parseInt(page);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        return parsedPage;
      }
    }

    return 1;
  }, [router.query]);

  return (
    <>
      <VoteMeta />
      <Layout containerSize="full">
        <DashboardGrid currentPage={pageNumber} />
      </Layout>
    </>
  );
};

export default DashboardPage;
