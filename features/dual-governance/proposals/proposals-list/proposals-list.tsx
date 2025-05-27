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
import Link from 'next/link';
import { config } from 'config';
import { PROPOSALS_PATH } from 'constants/urls';
import { Address } from 'viem';

const PAGE_LIMIT_STEP = 4;

export const ProposalsList = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    currentPage,
    combinedData,
    setCurrentPage,
    isFetching,
    activeProposals,
    votes,
  } = useDualGovernanceProposalsContext();

  const [pageLimit, setPageLimit] = useState(PAGE_LIMIT_STEP);

  useEffect(() => {
    if (initialLoading) {
      return;
    }
    const itemsLength = activeProposals.length + votes.length;

    const _pageLimit =
      PAGE_LIMIT_STEP > itemsLength ? PAGE_LIMIT_STEP : itemsLength;

    if (_pageLimit % 2 === 0) {
      setPageLimit(_pageLimit);
    } else {
      setPageLimit(_pageLimit + 1);
    }
  }, [activeProposals.length, initialLoading, votes.length]);

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
    if (initialLoading && !isFetching && combinedData) {
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
                <Link
                  href={`${config.voteOrigin}/vote/${dataItem.voteId}`}
                  key={dataItem.voteId}
                  target="_blank"
                >
                  <VoteItem
                    proposalId={dataItem.proposalId}
                    description={dataItem.event?.metadata}
                    script={dataItem.vote.script}
                    state={dataItem.state}
                    voteTime={dataItem.voteTime}
                    objectionPhaseTime={dataItem.objectionPhaseTime}
                    startDate={dataItem.vote.startDate}
                    yea={dataItem.vote.yea}
                    nay={dataItem.vote.nay}
                  />
                </Link>
              ) : (
                <Link
                  href={`${PROPOSALS_PATH}/${dataItem.proposalId}`}
                  key={dataItem.proposalId}
                >
                  <ProposalsListItem
                    id={dataItem.proposalId}
                    description={dataItem.DGEvent?.args.metadata || ''}
                    calls={dataItem.EPTEvent?.args?.calls}
                    proposalDetails={dataItem.proposalDetails}
                    proposer={dataItem.DGEvent?.args.proposerAccount as Address}
                  />
                </Link>
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
