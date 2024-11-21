import { useEffect, useState } from 'react';
import {
  ProposalCombinedData,
  useProposals,
} from 'features/dual-governance/hooks/use-proposals';
import { useActiveVotes } from 'shared/votes/hooks/use-active-votes';
import { VoteStatus } from 'shared/votes/types';

interface ProposalItem extends ProposalCombinedData {
  isVote: false;
}

// TODO: move to types
interface VoteItem {
  voteId: number;
  isVote: true;
  event: {
    metadata: string;
  };
  vote: {
    script: string;
  };
  state: {
    status: VoteStatus;
    isQuorumReached: boolean;
  };
}

type MergedItem = ProposalItem | VoteItem;

export const useMergedProposalsAndVotes = (): {
  mergedList: MergedItem[];
  isLoading: boolean;
} => {
  const [mergedList, setMergedList] = useState<MergedItem[]>([]);
  const { data: proposalsData, isLoading: isProposalsLoading } = useProposals(
    {},
  );
  const { data: votesData, isLoading: isVotesLoading } = useActiveVotes({
    currentPage: 1,
  });

  const isLoading = isProposalsLoading || isVotesLoading;

  useEffect(() => {
    if (!isProposalsLoading && !isVotesLoading && proposalsData && votesData) {
      const proposalsWithType: ProposalItem[] = proposalsData.proposals.map(
        (proposal) => ({
          ...proposal,
          isVote: false,
        }),
      );

      const votesWithType: VoteItem[] = votesData.votes.map((vote) => ({
        ...vote,
        isVote: true,
      }));

      const combinedList: MergedItem[] = [
        ...proposalsWithType,
        ...votesWithType,
      ].sort((a, b) => b.voteId - a.voteId);

      setMergedList(combinedList);
    }
  }, [proposalsData, votesData, isProposalsLoading, isVotesLoading]);

  return { mergedList, isLoading };
};
