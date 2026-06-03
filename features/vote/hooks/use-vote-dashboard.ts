import { useMemo, useState } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useWatchContractEvent } from 'wagmi';
import { aragonVotingAbi } from 'abi/generated';
import { useConfig } from 'config';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { useDebounce } from 'shared/hooks/use-debounce';
import { fetchAragonVotes } from 'shared/votes/utils/fetch-aragon-votes';
import { fetchVotesDescriptions } from 'shared/votes/utils/fetch-votes-descriptions';

const PAGE_SIZE = 5;
const DASHBOARD_VOTES_KEY = 'dashboard-votes';
const DASHBOARD_INFO_KEY = 'vote-dashboard-general-info';

export const VOTE_DASHBOARD_PAGE_SIZE = PAGE_SIZE;

export const useVoteDashboard = () => {
  const { chainId, rpcProvider } = useLidoSDK();
  const { useLocalCache } = useConfig().userConfig.savedUserConfig;
  const votingContract = useReadContract(Voting);
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 400);
  const isFiltering = debouncedQuery.trim() !== '';
  const isSettling = searchQuery !== debouncedQuery;

  const votingInfo = useQuery({
    queryKey: [DASHBOARD_INFO_KEY, chainId, votingContract.address],
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

  const { data: descriptions } = useQuery({
    queryKey: ['votes-descriptions', chainId, votingContract.address],
    queryFn: () => fetchVotesDescriptions(chainId, votingContract.address),
    staleTime: 60 * 1000,
  });

  const filteredIds = useMemo(() => {
    if (!isFiltering || !descriptions) {
      return [];
    }
    const needle = debouncedQuery.trim().toLowerCase();

    let exactId: number | null = null;
    if (/^\d+$/.test(needle)) {
      const numericId = Number(needle);
      if (numericId < totalVotes) {
        exactId = numericId;
      }
    }

    const textMatchedIds = new Set<number>();
    for (const [voteId, entry] of Object.entries(descriptions)) {
      const numericVoteId = Number(voteId);
      if (numericVoteId === exactId) {
        continue;
      }
      const text = entry.description || entry.metadata || '';
      if (text.toLowerCase().includes(needle)) {
        textMatchedIds.add(numericVoteId);
      }
    }

    const textMatches = Array.from(textMatchedIds).sort(
      (first, second) => second - first,
    );

    return exactId !== null ? [exactId, ...textMatches] : textMatches;
  }, [isFiltering, descriptions, debouncedQuery, totalVotes]);

  const votes = useInfiniteQuery({
    queryKey: [
      DASHBOARD_VOTES_KEY,
      chainId,
      votingContract.address,
      isFiltering ? debouncedQuery : 'all',
      useLocalCache,
    ],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      if (isFiltering) {
        const pageVoteIds = filteredIds.slice(
          pageParam * PAGE_SIZE,
          (pageParam + 1) * PAGE_SIZE,
        );
        return fetchAragonVotes({
          votingContract,
          chainId,
          client: rpcProvider,
          onlyActive: false,
          voteIds: pageVoteIds,
          useLocalCache,
        });
      }
      return fetchAragonVotes({
        votingContract,
        chainId,
        limit: PAGE_SIZE,
        offset: pageParam * PAGE_SIZE,
        client: rpcProvider,
        onlyActive: false,
        useLocalCache,
      });
    },
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (isFiltering) {
        const loadedCount = (lastPageParam + 1) * PAGE_SIZE;
        return loadedCount < filteredIds.length ? lastPageParam + 1 : undefined;
      }
      return lastPage.length === PAGE_SIZE ? lastPageParam + 1 : undefined;
    },
    enabled: !isFiltering || filteredIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  useWatchContractEvent({
    address: votingContract.address,
    abi: aragonVotingAbi,
    eventName: 'StartVote',
    onLogs: () => {
      void queryClient.invalidateQueries({
        queryKey: [DASHBOARD_VOTES_KEY, chainId, votingContract.address],
      });
      void queryClient.invalidateQueries({
        queryKey: [DASHBOARD_INFO_KEY, chainId, votingContract.address],
      });
    },
  });

  const info = votingInfo.data;
  const searchIntent = searchQuery.trim() !== '';
  const isSearchLoading =
    searchIntent && (isSettling || (filteredIds.length > 0 && votes.isLoading));

  return {
    searchQuery,
    setSearchQuery,
    clearFilter: () => setSearchQuery(''),
    debouncedQuery,
    isFiltering,
    isSettling,
    filteredCount: filteredIds.length,
    info,
    votesList: votes.data?.pages.flat() ?? [],
    showSkeletons: votes.isLoading || !info || isSearchLoading,
    hasNextPage: votes.hasNextPage,
    isFetchingNextPage: votes.isFetchingNextPage,
    fetchNextPage: votes.fetchNextPage,
    refetch: votes.refetch,
    error: votes.error || votingInfo.error,
  };
};
