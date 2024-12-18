import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useProposals } from 'features/dual-governance/hooks/use-proposals';
import { useProposal } from 'features/dual-governance/hooks/use-proposal';
import invariant from 'tiny-invariant';
import {
  ProposalCombinedData,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';
import { useVotes } from 'shared/votes/hooks/use-votes';
import { isVoteItem } from 'features/dual-governance/types';
import { useRouter } from 'next/router';
import { PROPOSALS_PATH } from '../constants/urls';
import { config } from 'config';
import { VoteData } from 'shared/votes/types';

const PROPOSALS_LIMIT = 5;
const VOTES_LIMIT = 5;

type ProposalsContextType = {
  proposalId: bigint | number | null;
  setProposalId: (id: bigint | number) => void;
  proposal: ProposalCombinedData | null;
  proposals: ProposalCombinedData[];
  activeProposals: ProposalCombinedData[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isFetching: boolean;
  isLoading: boolean;
  isProposalError: Error | null;
  votes: VoteData[];
  combinedData: (ProposalCombinedData | VoteData)[];
  openProposalPage: ({
    id,
    isVote,
  }: {
    id: number;
    isVote: boolean;
  }) => Promise<void>;
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
  const router = useRouter();

  const [proposalId, setProposalId] = useState<bigint | number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [proposals, setProposals] = useState<ProposalCombinedData[]>([]);

  const openProposalPage = useCallback(
    async ({ id, isVote }: { id: number; isVote: boolean }) => {
      if (isVote) {
        await router.push(`${config.voteOrigin}/vote/${id}`);
      }
      await router.push(`${PROPOSALS_PATH}/${id}`);
    },
    [router],
  );

  const existingProposal = useMemo(() => {
    return proposalId !== null
      ? proposals.find((proposal) => Number(proposal.id) === Number(proposalId))
      : null;
  }, [proposalId, proposals]);

  const proposalData = useProposal({
    id: proposalId,
    enabled: proposalId !== null && existingProposal === undefined,
  });

  const proposal = existingProposal ?? proposalData.data ?? null;

  console.log(proposal, existingProposal, 'proposal', 'existingProposal');

  const proposalsData = useProposals({
    currentPage,
    limit: PROPOSALS_LIMIT,
  });

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

  useEffect(() => {
    if (proposalsData.data?.proposals) {
      setProposals((prevProposals) => [
        ...prevProposals,
        ...proposalsData.data.proposals.filter(
          (newProposal) =>
            !prevProposals.some((existing) => existing.id === newProposal.id),
        ),
      ]);
    }
  }, [proposalsData.data?.proposals]);

  const value = useMemo(
    () => ({
      proposalId,
      setProposalId,
      proposal,
      proposals: proposals,
      activeProposals,
      votes: votesData?.votes || [],
      combinedData: getCombinedData(proposals, votesData?.votes || []),
      currentPage,
      setCurrentPage,
      isFetching: [
        proposalData?.isFetching || proposalsData.isFetching || isVotesFetching,
      ].some((isFetching) => isFetching),
      isLoading: [
        proposalData?.isLoading || proposalsData.isLoading || isVotesLoading,
      ].some((isLoading) => isLoading),
      isProposalError: proposalData?.error,
      openProposalPage,
    }),
    [
      proposalId,
      proposal,
      proposals,
      activeProposals,
      votesData?.votes,
      currentPage,
      proposalData?.isFetching,
      proposalData?.isLoading,
      proposalData?.error,
      proposalsData.isFetching,
      proposalsData.isLoading,
      isVotesFetching,
      isVotesLoading,
      openProposalPage,
    ],
  );
  return (
    <DualGovernanceProposalsContext.Provider value={value}>
      {children}
    </DualGovernanceProposalsContext.Provider>
  );
};
