import { useEffect, useState } from 'react';
import { useProposals } from 'features/dual-governance/hooks/use-proposals';
import { useActiveVotes, VoteData } from 'shared/votes/hooks/use-active-votes';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';

type MergedItem = ProposalCombinedData | VoteData;

type Props = {
  currentPage: number;
  itemsPerPage: number;
};

export const useProposalsAndVotes = ({
  currentPage,
  itemsPerPage,
}: Props): {
  data: MergedItem[];
  isLoading: boolean;
} => {
  const [mergedList, setMergedList] = useState<MergedItem[]>([]);

  const proposalLimit = Math.ceil(itemsPerPage / 2);
  const votesLimit = itemsPerPage - proposalLimit;

  const { data: votesData, isLoading: isVotesLoading } = useActiveVotes({
    limit: votesLimit,
    getActive: true,
  });
  const { data: proposalsData, isLoading: isProposalsLoading } = useProposals({
    currentPage,
    itemsPerPage: proposalLimit,
  });
  const isLoading = isProposalsLoading || isVotesLoading;

  useEffect(() => {
    if (!isLoading && proposalsData && votesData) {
      const combinedList: MergedItem[] = [
        ...proposalsData.proposals,
        ...votesData.votes,
      ];

      if (combinedList.length > 0) {
        setMergedList(combinedList.sort((a, b) => b.id - a.id));
      }

      setMergedList(combinedList);
    }
  }, [proposalsData, votesData, isLoading]);

  return {
    data: mergedList,
    isLoading,
  };
};
