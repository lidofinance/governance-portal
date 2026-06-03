import { Container } from '@lidofinance/lido-ui';
import { AttentionBanner } from 'shared/components/attention-banner';
import { Text } from 'shared/components/text';
import {
  useVoteDashboard,
  VOTE_DASHBOARD_PAGE_SIZE,
} from 'features/vote/hooks/use-vote-dashboard';
import { GridWrap, DashboardGridHeading, LoadMoreCard } from './style';
import { DashboardVoteSkeleton } from '../dashboard-vote-skeleton';
import { DashboardVote } from '../dashboard-vote';
import { VoteSearch } from '../vote-search';
import { VoteSearchSummary } from '../vote-search-summary';

const PAGE_RANGE = Array.from(
  { length: VOTE_DASHBOARD_PAGE_SIZE },
  (_, index) => index,
);

export const DashboardGrid = () => {
  const {
    searchQuery,
    setSearchQuery,
    clearFilter,
    debouncedQuery,
    isFiltering,
    isSettling,
    filteredCount,
    info,
    votesList,
    showSkeletons,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useVoteDashboard();

  if (error) {
    console.error('Error fetching votes:', error);
    return (
      <Container as="main" size="tight">
        <AttentionBanner>Error fetching voting data</AttentionBanner>
      </Container>
    );
  }

  return (
    <>
      <DashboardGridHeading>
        <Text size={26} weight={700}>
          All votes
        </Text>
        <VoteSearch value={searchQuery} onChange={setSearchQuery} />
      </DashboardGridHeading>
      {isFiltering && !isSettling && (
        <VoteSearchSummary
          count={filteredCount}
          query={debouncedQuery}
          onClear={clearFilter}
        />
      )}
      <GridWrap>
        {showSkeletons || !info
          ? PAGE_RANGE.map((index) => <DashboardVoteSkeleton key={index} />)
          : votesList.map((voteData) => (
              <DashboardVote
                key={voteData.id}
                vote={voteData}
                startEvent={voteData.startEvent}
                executeEvent={voteData.executeEvent}
                description={voteData.description}
                voteTime={info.voteTime}
                objectionPhaseTime={info.objectionPhaseTime}
                onPass={refetch}
              />
            ))}
        {!showSkeletons && hasNextPage && (
          <LoadMoreCard
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load More'}
          </LoadMoreCard>
        )}
      </GridWrap>
    </>
  );
};
