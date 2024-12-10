import { ProposalsListItem } from 'features/dual-governance/proposals/proposals-list/proposals-list-item';
import { VoteItem } from 'features/dual-governance/proposals/proposals-list/vote-item';
import {
  InlineLoaderStyled,
  ProposalsListWrapper,
  ShowMoreWrapper,
} from 'features/dual-governance/proposals/proposals-list/style';

import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { Button } from 'shared/components/button';
import { isVoteItem } from 'features/dual-governance/types';
import { useEffect, useState } from 'react';
import { FlexWrapper } from 'shared/styled-components';

export const ProposalsList = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    currentPage,
    combinedData,
    setCurrentPage,
    isFetching,
    openProposalPage,
  } = useDualGovernanceProposalsContext();

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    if (initialLoading && !isFetching) {
      setInitialLoading(false);
    }
  }, [combinedData, initialLoading, isFetching]);

  return (
    <>
      {initialLoading && isFetching && (
        <FlexWrapper $gap="20px">
          <InlineLoaderStyled />
          <InlineLoaderStyled />
        </FlexWrapper>
      )}
      {!initialLoading && (
        <>
          <ProposalsListWrapper>
            {combinedData.map((proposal) => {
              return isVoteItem(proposal) ? (
                <VoteItem
                  key={proposal.voteId}
                  id={proposal.id}
                  description={proposal.event?.metadata}
                  script={proposal.vote.script}
                  voteState={proposal.state}
                  isAragon
                  slim
                  onProposalClick={() =>
                    openProposalPage({ id: proposal.id, isVote: true })
                  }
                />
              ) : (
                <ProposalsListItem
                  key={proposal.id}
                  id={proposal.id}
                  description={proposal.event.args.metadata}
                  calls={proposal.event.args.calls}
                  proposalInfo={proposal.proposalInfo}
                  slim
                  onProposalClick={() =>
                    openProposalPage({ id: proposal.id, isVote: false })
                  }
                />
              );
            })}
          </ProposalsListWrapper>
          <ShowMoreWrapper>
            <Button
              loading={isFetching}
              variant="outlined"
              onClick={handleLoadMore}
              disabled={isFetching}
            >
              Show more
            </Button>
          </ShowMoreWrapper>
        </>
      )}
    </>
  );
};
