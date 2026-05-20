import { Container } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchAragonVotes } from 'shared/votes/utils/fetch-aragon-votes';
import { useWatchContractEvent } from 'wagmi';
import { aragonVotingAbi } from 'abi/generated';
import { AttentionBanner } from 'shared/components/attention-banner';
import { GridWrap, DashboardGridHeading, LoadMoreCard } from './style';
import { Text } from 'shared/components/text';
import { DashboardVoteSkeleton } from '../dashboard-vote-skeleton';
import { DashboardVote } from '../dashboard-vote';
import { VoteSearch } from '../vote-search';

const PAGE_SIZE = 5;
const PAGE_RANGE = Array.from({ length: PAGE_SIZE }, (_, i) => i);

export const DashboardGrid = () => {
  const { chainId, rpcProvider } = useLidoSDK();
  const votingContract = useReadContract(Voting);
  const queryClient = useQueryClient();

  const votingInfo = useQuery({
    queryKey: ['vote-dashboard-general-info', chainId, votingContract.address],
    queryFn: async () => {
      const [votesLength, voteTime, objectionPhaseTime] = await Promise.all([
        votingContract.readContract('votesLength'),
        votingContract.readContract('voteTime'),
        votingContract.readContract('objectionPhaseTime'),
      ]);

      return {
        voteTime: Number(voteTime),
        objectionPhaseTime: Number(objectionPhaseTime),
        votesLength: Number(votesLength),
      };
    },
    staleTime: Infinity,
  });

  const totalVotes = votingInfo.data?.votesLength ?? 0;

  const votes = useInfiniteQuery({
    queryKey: ['dashboard-votes', chainId, votingContract.address],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchAragonVotes({
        votingContract,
        chainId,
        limit: PAGE_SIZE,
        offset: pageParam,
        client: rpcProvider,
        onlyActive: false,
      }),
    getNextPageParam: (_lastPage, _allPages, lastPageParam) => {
      const loaded = lastPageParam + PAGE_SIZE;
      return totalVotes > 0 && loaded < totalVotes ? loaded : undefined;
    },
    staleTime: 10 * 60 * 1000,
  });

  const votesList = votes.data?.pages.flat() ?? [];

  useWatchContractEvent({
    address: votingContract.address,
    abi: aragonVotingAbi,
    eventName: 'StartVote',
    onLogs: () => {
      void queryClient.invalidateQueries({
        queryKey: ['dashboard-votes', chainId, votingContract.address],
      });
      void queryClient.invalidateQueries({
        queryKey: [
          'vote-dashboard-general-info',
          chainId,
          votingContract.address,
        ],
      });
    },
  });

  if (votes.error || votingInfo.error) {
    console.error('Error fetching votes:', votes.error || votingInfo.error);
    return (
      <Container as="main" size="tight">
        <AttentionBanner>Error fetching voting data</AttentionBanner>
      </Container>
    );
  }

  const info = votingInfo.data;
  const isInitialLoading = votes.isLoading || !info;

  return (
    <>
      <DashboardGridHeading>
        <Text size={26} weight={700}>
          All votes
        </Text>
        <VoteSearch />
      </DashboardGridHeading>
      <GridWrap>
        {isInitialLoading
          ? PAGE_RANGE.map((i) => <DashboardVoteSkeleton key={i} />)
          : votesList.map((voteData) => (
              <DashboardVote
                key={voteData.id}
                vote={voteData}
                startEvent={voteData.startEvent}
                executeEvent={voteData.executeEvent}
                description={voteData.description}
                voteTime={info.voteTime}
                objectionPhaseTime={info.objectionPhaseTime}
                onPass={votes.refetch}
              />
            ))}
        {!isInitialLoading && votes.hasNextPage && (
          <LoadMoreCard
            onClick={() => votes.fetchNextPage()}
            disabled={votes.isFetchingNextPage}
          >
            {votes.isFetchingNextPage ? 'Loading…' : 'Load More'}
          </LoadMoreCard>
        )}
      </GridWrap>
    </>
  );
};
