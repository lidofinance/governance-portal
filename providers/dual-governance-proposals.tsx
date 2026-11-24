import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ProposalsQueryResult, useProposals } from '@dg/hooks/use-proposals';
import { useFlaggedProposalIds } from '@dg/hooks/use-flagged-proposal-ids';
import invariant from 'tiny-invariant';
import { ProposalCombinedData, ProposalStatus } from '@dg/proposals/types';
import { useActiveVotes } from 'shared/votes/hooks/use-active-votes';
import { VoteData } from 'shared/votes/types';
import {
  QueryObserverResult,
  RefetchOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useProposalDelaysQuery } from '../features/dual-governance/hooks/use-proposal-timelock';
import { sortProposals } from '../utils/proposals/sort-proposals';

const VOTES_LIMIT = 15;

type ProposalsContextType = {
  proposals: ProposalCombinedData[];
  activeProposals: (ProposalCombinedData | VoteData)[];
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  votes: VoteData[];
  combinedData: (ProposalCombinedData | VoteData)[];
  getProposalById: (id: number) => ProposalCombinedData | null;
  refetchProposals: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<ProposalsQueryResult | undefined, Error>>;
};

const DualGovernanceProposalsContext = createContext<
  ProposalsContextType | undefined
>(undefined);

export const useDualGovernanceProposalsContext = () => {
  const value = useContext(DualGovernanceProposalsContext);
  invariant(
    value,
    'useDualGovernanceProposalsContext was used outside the DualGovernanceProposalsContext provider',
  );
  return value;
};

const getCombinedData = ({
  proposals,
  votes = [],
  afterSubmitDelay = 0,
  afterScheduleDelay = 0,
}: {
  proposals: ProposalCombinedData[];
  votes?: VoteData[];
  afterSubmitDelay?: number;
  afterScheduleDelay?: number;
}): Array<ProposalCombinedData | VoteData> => {
  if (afterSubmitDelay <= 0 || afterScheduleDelay <= 0) {
    return [];
  }

  const sortedProposals = sortProposals({
    proposals,
    afterScheduleDelay,
    afterSubmitDelay,
  });

  const [activeProposals, completedProposals] = sortedProposals.reduce(
    ([active, completed], proposal) => {
      const target =
        proposal.proposalDetails.status === ProposalStatus.Executed ||
        proposal.proposalDetails.status === ProposalStatus.Cancelled
          ? completed
          : active;
      target.push(proposal);
      return [active, completed];
    },
    [[], []] as [ProposalCombinedData[], ProposalCombinedData[]],
  );

  const allProposalIds = new Set([
    ...activeProposals.map((proposal) => proposal.proposalId),
    ...completedProposals.map((proposal) => proposal.proposalId),
  ]);

  const uniqueVotes = votes.filter(
    (vote) => !allProposalIds.has(vote.proposalId),
  );

  return [...activeProposals, ...uniqueVotes, ...completedProposals];
};

type DualGovernanceProposalsProviderProps = PropsWithChildren<{
  id?: number;
}>;

export const DualGovernanceProposalsProvider: React.FC<
  DualGovernanceProposalsProviderProps
> = ({ children, id }) => {
  const {
    data: allProposalsData,
    isLoading: isAllProposalsLoading,
    isFetching: isAllProposalsFetching,
    refetch: refetchProposals,
    isError: isProposalDataError,
  } = useProposals({ id }) as UseQueryResult<ProposalsQueryResult>;

  const {
    data: flaggedProposalIds,
    isLoading: isFlaggedLoading,
    isFetching: isFlaggedFetching,
    isError: isFlaggedError,
  } = useFlaggedProposalIds({ enabled: id === undefined });

  const isProposalDataLoading = isAllProposalsLoading || isFlaggedLoading;
  const isProposalsDataFetching = isAllProposalsFetching || isFlaggedFetching;

  const proposalsData = useMemo(() => {
    if (!allProposalsData || !('proposals' in allProposalsData)) {
      return allProposalsData;
    }
    // Fail closed: without the flagged IDs any listed proposal may be one to hide
    if (isFlaggedError || !flaggedProposalIds) {
      return { ...allProposalsData, proposals: [] };
    }
    if (flaggedProposalIds.length === 0) {
      return allProposalsData;
    }
    return {
      ...allProposalsData,
      proposals: allProposalsData.proposals.filter(
        (proposal) => !flaggedProposalIds.includes(proposal.proposalId),
      ),
    };
  }, [allProposalsData, flaggedProposalIds, isFlaggedError]);

  const { data: proposalsDelays } = useProposalDelaysQuery({ enabled: true });

  const {
    data: votesData,
    isFetching: isVotesFetching,
    isLoading: isVotesLoading,
  } = useActiveVotes({
    limit: VOTES_LIMIT,
  });

  const activeProposals = useMemo(() => {
    if (!proposalsData || isProposalDataLoading) {
      return [];
    }

    if (!('proposals' in proposalsData)) {
      return [];
    }

    const _proposals = proposalsData.proposals.filter((proposal) =>
      [ProposalStatus.Submitted, ProposalStatus.Scheduled].includes(
        proposal.proposalDetails.status,
      ),
    );

    const votes = votesData?.votes ?? [];

    const proposalIds = new Set(
      _proposals.map((proposal) => proposal.proposalId),
    );

    const uniqueVotes = votes.filter(
      (vote) => !proposalIds.has(vote.proposalId),
    );

    return [..._proposals, ...uniqueVotes];
  }, [isProposalDataLoading, proposalsData, votesData?.votes]);

  const getProposalById = useCallback(
    (id: number) => {
      if (!proposalsData || isProposalDataLoading) {
        return null;
      }

      if (!('proposals' in proposalsData)) {
        return null;
      }

      const proposal = proposalsData.proposals.find(
        (proposal) => Number(proposal.proposalId) === id,
      );

      return proposal || null;
    },
    [proposalsData, isProposalDataLoading],
  );

  const value = useMemo(
    () => ({
      proposals:
        proposalsData && 'proposals' in proposalsData
          ? proposalsData.proposals
          : [],
      activeProposals,
      votes: votesData?.votes || [],
      combinedData: getCombinedData({
        proposals:
          proposalsData && 'proposals' in proposalsData
            ? proposalsData.proposals
            : [],
        votes: votesData?.votes || [],
        afterSubmitDelay: proposalsDelays?.afterSubmitDelay,
        afterScheduleDelay: proposalsDelays?.afterScheduleDelay,
      }),
      isFetching: [isProposalsDataFetching || isVotesFetching].some(
        (isFetching) => isFetching,
      ),
      isLoading: [isProposalDataLoading || isVotesLoading].some(
        (isLoading) => isLoading,
      ),
      getProposalById,
      isError: isProposalDataError || isFlaggedError,
      refetchProposals: refetchProposals as unknown as (
        options?: RefetchOptions | undefined,
      ) => Promise<
        QueryObserverResult<ProposalsQueryResult | undefined, Error>
      >,
    }),
    [
      proposalsData,
      activeProposals,
      votesData?.votes,
      proposalsDelays?.afterSubmitDelay,
      proposalsDelays?.afterScheduleDelay,
      isProposalsDataFetching,
      isVotesFetching,
      isProposalDataLoading,
      isVotesLoading,
      getProposalById,
      isProposalDataError,
      isFlaggedError,
      refetchProposals,
    ],
  );
  return (
    <DualGovernanceProposalsContext.Provider value={value}>
      {children}
    </DualGovernanceProposalsContext.Provider>
  );
};
