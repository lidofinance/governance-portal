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
import { isVoteItem } from 'features/dual-governance/types';
import { VoteData } from 'shared/votes/types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';

const VOTES_LIMIT = 5;

type ProposalsContextType = {
  proposals: ProposalCombinedData[];
  activeProposals: ProposalCombinedData[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
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

const getCombinedData = (
  proposals: ProposalCombinedData[],
  votes: VoteData[] | [],
) =>
  [...proposals, ...votes].sort((a, b) => {
    if (isVoteItem(a) && !isVoteItem(b)) return -1;
    if (!isVoteItem(a) && isVoteItem(b)) return 1;

    return b.id;
  });

export const DualGovernanceProposalsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [proposals, setProposals] = useState<ProposalCombinedData[]>([]);

  const proposalsData = useProposals();

  const { refetch: refetchProposals } = proposalsData;

  const {
    data: votesData,
    isFetching: isVotesFetching,
    isLoading: isVotesLoading,
  } = useVotes({
    limit: VOTES_LIMIT,
    getActive: true,
  });

  const activeProposals = useMemo(() => {
    return proposals.filter((proposal) =>
      [ProposalStatus.Submitted, ProposalStatus.Scheduled].includes(
        proposal.proposalDetails.status,
      ),
    );
  }, [proposals]);

  const getProposalById = useCallback(
    (id: number) => {
      const proposal = proposals.find((proposal) => Number(proposal.id) === id);

      return proposal || null;
    },
    [proposals],
  );

  useEffect(() => {
    if (proposalsData.data?.proposals) {
      const newProposals = proposalsData.data.proposals;

      setProposals((prevProposals) => {
        // this is to properly handle the status update on refetch while using lazy loading
        const updatedIds = new Set(newProposals.map((proposal) => proposal.id));

        return [
          ...prevProposals.filter((proposal) => !updatedIds.has(proposal.id)), // Keep the old proposals that are not updated
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
      combinedData: getCombinedData(proposals, votesData?.votes || []),
      currentPage,
      setCurrentPage,
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
      currentPage,
      proposalsData.isFetching,
      proposalsData.isLoading,
      isVotesFetching,
      isVotesLoading,
      getProposalById,
      refetchProposals,
    ],
  );
  return (
    <DualGovernanceProposalsContext.Provider value={value}>
      {children}
    </DualGovernanceProposalsContext.Provider>
  );
};
