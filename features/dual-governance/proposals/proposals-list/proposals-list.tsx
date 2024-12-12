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
import { useEffect, useMemo, useState } from 'react';
import { FlexWrapper } from 'shared/styled-components';

const PAGE_LIMIT_STEP = 4;

export const ProposalsList = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    currentPage,
    combinedData,
    setCurrentPage,
    isFetching,
    openProposalPage,
    activeProposals,
    votes,
  } = useDualGovernanceProposalsContext();

  const initialLimit = useMemo(() => {
    const itemsLength = activeProposals.length + votes.length;

    return PAGE_LIMIT_STEP > itemsLength ? PAGE_LIMIT_STEP : itemsLength;
  }, []);

  const [pageLimit, setPageLimit] = useState(initialLimit);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setPageLimit((prevState) => {
      if (prevState !== 0) {
        return prevState + PAGE_LIMIT_STEP;
      }
      return 0;
    });
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
            {combinedData.slice(0, pageLimit).map((dataItem) => {
              return isVoteItem(dataItem) ? (
                <VoteItem
                  key={dataItem.voteId}
                  id={dataItem.id}
                  description={dataItem.event?.metadata}
                  script={dataItem.vote.script}
                  state={dataItem.state}
                  voteTime={dataItem.voteTime}
                  objectionPhaseTime={dataItem.objectionPhaseTime}
                  startDate={dataItem.vote.startDate}
                  yea={dataItem.vote.yea}
                  nay={dataItem.vote.nay}
                  onVoteClick={() =>
                    openProposalPage({ id: dataItem.id, isVote: true })
                  }
                />
              ) : (
                <ProposalsListItem
                  key={dataItem.id}
                  id={dataItem.id}
                  description={dataItem.event.args.metadata || ''}
                  calls={dataItem.event.args.calls}
                  proposalDetails={dataItem.proposalDetails}
                  onProposalClick={() =>
                    openProposalPage({ id: dataItem.id, isVote: false })
                  }
                />
              );
            })}
          </ProposalsListWrapper>
          {pageLimit < combinedData.length && pageLimit !== 0 && (
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
          )}
        </>
      )}
    </>
  );
};
