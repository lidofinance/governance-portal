import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { useProposalDelaysQuery } from '../features/dual-governance/hooks/use-proposal-timelock';
import { sortProposals } from '../utils/proposals/sort-proposals';

const VOTES_LIMIT = 15;

type ProposalsContextType = {
  proposals: ProposalCombinedData[];
  activeProposals: (ProposalCombinedData | VoteData)[];
  isFetching: boolean;
  isLoading: boolean;
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

export const DualGovernanceProposalsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [proposals, setProposals] = useState<ProposalCombinedData[]>([]);

  const proposalsData = useProposals();

  const { refetch: refetchProposals } = proposalsData;

  const { data: proposalsDelays } = useProposalDelaysQuery({ enabled: true });

  const {
    data: votesData,
    isFetching: isVotesFetching,
    isLoading: isVotesLoading,
  } = useVotes({
    limit: VOTES_LIMIT,
  });

  const activeProposals = useMemo(() => {
    const _proposals = proposals.filter((proposal) =>
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
  }, [proposals, votesData]);

  const getProposalById = useCallback(
    (id: number) => {
      const proposal = proposals.find(
        (proposal) => Number(proposal.proposalId) === id,
      );

      return proposal || null;
    },
    [proposals],
  );

  useEffect(() => {
    if (proposalsData.data?.proposals) {
      const newProposals = proposalsData.data.proposals;

      setProposals((prevProposals) => {
        // this is to properly handle the status update on refetch while using lazy loading
        const updatedIds = new Set(
          newProposals.map((proposal) => proposal.proposalId),
        );

        return [
          ...prevProposals.filter(
            (proposal) => !updatedIds.has(proposal.proposalId),
          ), // Keep the old proposals that are not updated
          ...newProposals,
        ];
      });
    }
  }, [proposalsData.data?.proposals]);

  const value = useMemo(
    () => ({
      proposals: proposals,
      activeProposals,
      votes: votesData?.votes || [],
      combinedData: getCombinedData({
        proposals,
        votes: votesData?.votes || [],
        afterSubmitDelay: proposalsDelays?.afterSubmitDelay,
        afterScheduleDelay: proposalsDelays?.afterScheduleDelay,
      }),
      isFetching: [proposalsData.isFetching || isVotesFetching].some(
        (isFetching) => isFetching,
      ),
      isLoading: [proposalsData.isLoading || isVotesLoading].some(
        (isLoading) => isLoading,
      ),
      getProposalById,
      refetchProposals: refetchProposals,
    }),
    [
      proposals,
      activeProposals,
      votesData?.votes,
      proposalsData.isFetching,
      proposalsData.isLoading,
      isVotesFetching,
      isVotesLoading,
      getProposalById,
      refetchProposals,
      proposalsDelays,
    ],
  );
  return (
    <DualGovernanceProposalsContext.Provider value={value}>
      {children}
    </DualGovernanceProposalsContext.Provider>
  );
};
