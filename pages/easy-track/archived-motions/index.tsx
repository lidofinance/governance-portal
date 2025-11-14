import { Layout } from 'shared/components';
import { Text } from 'shared/components/text';
import { useArchivedMotions } from 'features/easy-track/hooks/use-motions';
import { MotionCard } from 'features/easy-track/motion-card';
import { MotionsGrid } from 'features/easy-track/motions/style';
import { InlineLoader, Button } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

const LoadMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const ArchivePage = () => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useArchivedMotions();

  // Flatten all pages into a single array
  const motions = data?.pages.flat() ?? [];

  if (isLoading) {
    return (
      <Layout containerSize="full">
        <InlineLoader />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout containerSize="full">
        <div style={{ textAlign: 'center' }}>
          <Text size={16} color="error">
            Error loading archived motions: {error.message}
          </Text>
        </div>
      </Layout>
    );
  }

  return (
    <Layout containerSize="full">
      <Title>
        <Text size={24} strong>
          Archived Motions
        </Text>
        <Text color="secondary" size={12}>
          Select the card to see details
        </Text>
      </Title>

      {motions.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Text size={16} weight={500} color="secondary">
            No archived motions found
          </Text>
        </div>
      ) : (
        <>
          <MotionsGrid>
            {motions.map((motion) => (
              <MotionCard key={motion.id} motion={motion} />
            ))}
          </MotionsGrid>

          {hasNextPage && (
            <LoadMoreWrapper>
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                loading={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </Button>
            </LoadMoreWrapper>
          )}

          {isFetching && !isFetchingNextPage && (
            <LoadMoreWrapper>
              <InlineLoader />
            </LoadMoreWrapper>
          )}
        </>
      )}
    </Layout>
  );
};

export default ArchivePage;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
