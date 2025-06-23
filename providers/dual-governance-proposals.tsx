import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import {
  ProposalsQueryResult,
  useProposals,
} from 'features/dual-governance/hooks/use-proposals';
import invariant from 'tiny-invariant';
import {
  ProposalCombinedData,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';
import { useVotes } from 'shared/votes/hooks/use-votes';
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
    data: proposalsData,
    isLoading: isProposalDataLoading,
    isFetching: isProposalsDataFetching,
    refetch: refetchProposals,
    isError: isProposalDataError,
  } = useProposals({ id }) as UseQueryResult<ProposalsQueryResult>;

  const { data: proposalsDelays } = useProposalDelaysQuery({ enabled: true });

  const {
    data: votesData,
    isFetching: isVotesFetching,
    isLoading: isVotesLoading,
  } = useVotes({
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
      isError: isProposalDataError,
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
      refetchProposals,
    ],
  );
  return (
    <DualGovernanceProposalsContext.Provider value={value}>
      {children}
    </DualGovernanceProposalsContext.Provider>
  );
};
