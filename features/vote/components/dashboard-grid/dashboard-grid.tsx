import Router from 'next/router';
import { useEffect } from 'react';
import { Container, Pagination } from '@lidofinance/lido-ui';
import { VOTE_DASHBOARD_INDEX_PATH, voteDashboardPage } from 'constants/urls';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchAragonVotes } from 'shared/votes/utils/fetch-aragon-votes';
import { getEventsExecuteVote } from 'shared/votes/utils/get-events-execute-vote';
import { estimateExecuteVoteBlockRange } from 'shared/votes/utils/estimate-execute-vote-block-range';
import { useWatchContractEvent } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { aragonVotingAbi } from 'abi/generated';
import { AttentionBanner } from 'shared/components/attention-banner';
import { GridWrap, PaginationWrap, DashboardGridHeading } from './style';
import { Text } from 'shared/components/text';
import { DashboardVoteSkeleton } from '../dashboard-vote-skeleton';
import { DashboardVote } from '../dashboard-vote';
import { VoteSearch } from '../vote-search';

const PAGE_SIZE = 12;

const PAGE_RANGE = Array.from({ length: PAGE_SIZE }, (_, i) => i);

const handleChangePage = (nextPage: number) => {
  void Router.push(voteDashboardPage(nextPage));
};

const getPageKey = (chainId: CHAINS, page: number) => [
  'dashboard-votes',
  chainId,
  page,
];

type Props = {
  currentPage: number;
};

export const DashboardGrid = ({ currentPage }: Props) => {
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

  const votes = useQuery({
    queryKey: getPageKey(chainId, currentPage),
    queryFn: () =>
      fetchAragonVotes({
        votingContract,
        chainId,
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
        client: rpcProvider,
        onlyActive: false,
      }),
    placeholderData: keepPreviousData,
    staleTime: currentPage === 1 ? 600 * 1000 : Infinity, // 10 minutes for the first page
  });

  const executeEvents = useQuery({
    queryKey: ['execute-events', chainId, currentPage],
    enabled: !!votes.data && !!votingInfo.data,
    staleTime: currentPage === 1 ? 600 * 1000 : Infinity,
    queryFn: async () => {
      if (!votingInfo.data || !votes.data) {
        return {};
      }

      const latestBlock = await rpcProvider.getBlock({ blockTag: 'latest' });
      const voteTimeSecs = votingInfo.data.voteTime;

      return getEventsExecuteVote({
        address: votingContract.address,
        client: rpcProvider,
        votes: votes.data
          .filter((v) => v.executed)
          .map((v) => {
            const { fromBlock, toBlock } = estimateExecuteVoteBlockRange({
              snapshotBlockNumber: v.snapshotBlock,
              startDate: v.startDate,
              voteTimeSecs,
              latestBlock,
            });
            return { id: v.id, fromBlock, toBlock };
          }),
      });
    },
  });

  const isLoading = votingInfo.isLoading || votes.isFetching;
  const mergedVotes = votes.data?.map((v) => ({
    ...v,
    executeEvent: executeEvents.data?.[v.id.toString()] ?? null,
  }));
  const pagesCount = votingInfo.data?.votesLength
    ? Math.ceil(votingInfo.data.votesLength / PAGE_SIZE)
    : 1;

  const isOutOfPageBounds =
    (!votingInfo.isLoading && currentPage > pagesCount) || currentPage < 1;

  useEffect(() => {
    if (isOutOfPageBounds) {
      void Router.replace(VOTE_DASHBOARD_INDEX_PATH);
    }
  }, [isOutOfPageBounds]);

  useWatchContractEvent({
    address: votingContract.address,
    abi: aragonVotingAbi,
    eventName: 'StartVote',
    onLogs: () => {
      void queryClient.invalidateQueries({
        queryKey: getPageKey(chainId, 1),
      });
    },
  });

  if (isOutOfPageBounds) {
    return null;
  }

  if (votes.error || votingInfo.error) {
    console.error('Error fetching votes:', votes.error || votingInfo.error);
    return (
      <Container as="main" size="tight">
        <AttentionBanner>Error fetching voting data</AttentionBanner>
      </Container>
    );
  }

  if (!votingInfo.data) {
    return null;
  }

  return (
    <>
      <DashboardGridHeading>
        <Text size={26} weight={700}>
          All votes
        </Text>
        <VoteSearch />
      </DashboardGridHeading>
      <GridWrap>
        {isLoading
          ? PAGE_RANGE.map((i) => <DashboardVoteSkeleton key={i} />)
          : mergedVotes?.map((voteData) => (
              <DashboardVote
                key={voteData.id}
                vote={voteData}
                startEvent={voteData.startEvent}
                executeEvent={voteData.executeEvent}
                voteTime={votingInfo.data.voteTime}
                objectionPhaseTime={votingInfo.data.objectionPhaseTime}
                onPass={votes.refetch}
              />
            ))}
      </GridWrap>
      <PaginationWrap>
        <Pagination
          pagesCount={pagesCount}
          activePage={currentPage}
          onItemClick={(idx: number) => handleChangePage(idx)}
          siblingCount={1}
        />
      </PaginationWrap>
    </>
  );
};
