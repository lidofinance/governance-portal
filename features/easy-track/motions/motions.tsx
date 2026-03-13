import { useState, useEffect } from 'react';
import { useActiveMotions, useArchivedMotions } from '../hooks/use-motions';
import { MotionCard } from '../motion-card';
import { MotionCardSkeleton } from '../motion-card-skeleton/motion-card-skeleton';
import { MotionsGrid } from './style';
import { InlineLoader, Button } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const INITIAL_TOTAL = 8;
const ARCHIVE_PAGE_SIZE = 8;

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

export const Motions = () => {
  const { data: activeMotions, isLoading: activeLoading } = useActiveMotions();
  const {
    data: archivedData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching: archiveFetching,
  } = useArchivedMotions();

  const allArchived = archivedData?.pages.flat() ?? [];

  const [archiveDisplayCount, setArchiveDisplayCount] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!activeLoading && archiveDisplayCount === null) {
      const activeCount = activeMotions?.length ?? 0;
      setArchiveDisplayCount(Math.max(0, INITIAL_TOTAL - activeCount));
    }
  }, [activeLoading, activeMotions, archiveDisplayCount]);

  const canLoadMore =
    archiveDisplayCount !== null &&
    (archiveDisplayCount < allArchived.length || hasNextPage);

  const handleLoadMore = () => {
    const newLimit = (archiveDisplayCount ?? 0) + ARCHIVE_PAGE_SIZE;
    setArchiveDisplayCount(newLimit);
    if (newLimit > allArchived.length && hasNextPage) {
      void fetchNextPage();
    }
  };

  const motionsToShow = [
    ...(activeMotions ?? []),
    ...allArchived.slice(0, archiveDisplayCount ?? 0),
  ];

  if (activeLoading) {
    return (
      <MotionsGrid>
        {Array.from({ length: INITIAL_TOTAL }, (_, i) => (
          <MotionCardSkeleton key={i} />
        ))}
      </MotionsGrid>
    );
  }

  const hasMotions = motionsToShow.length > 0;

  if (!hasMotions && archiveDisplayCount !== null) {
    return <div>No motions at the moment</div>;
  }

  return (
    <>
      <MotionsGrid>
        {motionsToShow.map((motion) => (
          <MotionCard motion={motion} key={motion.id.toString()} />
        ))}
      </MotionsGrid>

      {canLoadMore && (
        <LoadMoreWrapper>
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            loading={isFetchingNextPage}
          >
            Load More
          </Button>
        </LoadMoreWrapper>
      )}

      {archiveFetching && !isFetchingNextPage && (
        <LoadMoreWrapper>
          <InlineLoader />
        </LoadMoreWrapper>
      )}
    </>
  );
};
