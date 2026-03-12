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
import { useEffect, useState, useMemo } from 'react';
import { FlexWrapper } from 'shared/styled-components';
import Link from 'next/link';
import { PROPOSALS_PATH, votePage } from 'constants/urls';
import { Address } from 'viem';

const INITIAL_DISPLAY_LIMIT = 4;

export const ProposalsList = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  const { combinedData, isFetching, activeProposals, votes } =
    useDualGovernanceProposalsContext();

  const [showAll, setShowAll] = useState(false);

  const handleLoadMore = () => {
    setShowAll(true);
  };

  const itemsToDisplay = useMemo(() => {
    const activeItems = activeProposals;

    const completedProposals = combinedData.filter((item) => {
      const inActiveProposals = activeProposals.some((ap) => {
        return isVoteItem(ap) && isVoteItem(item)
          ? ap.voteId === item.voteId
          : !isVoteItem(ap) && !isVoteItem(item)
            ? ap.proposalId === item.proposalId
            : false;
      });

      const inVotes = votes.some((v) => {
        return isVoteItem(v) && isVoteItem(item)
          ? v.voteId === item.voteId
          : false;
      });

      return !inActiveProposals && !inVotes;
    });

    const completedToShow = showAll
      ? completedProposals
      : completedProposals.slice(
          0,
          Math.max(0, INITIAL_DISPLAY_LIMIT - activeItems.length),
        );

    const itemsToShow = [...activeItems, ...completedToShow];

    return itemsToShow.map((dataItem, index) => {
      return isVoteItem(dataItem) ? (
        <Link
          href={votePage(dataItem.voteId)}
          key={`vote-${dataItem.voteId}-${index}`}
          target="_blank"
        >
          <VoteItem
            proposalId={dataItem.proposalId}
            description={dataItem.event?.args.metadata}
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
          key={`proposal-${dataItem.proposalId}-${index}`}
        >
          <ProposalsListItem
            id={dataItem.proposalId}
            description={dataItem.DGEvent?.args.metadata || ''}
            calls={dataItem.proposalDetails.calls}
            proposalDetails={dataItem.proposalDetails}
            proposer={dataItem.DGEvent?.args.proposerAccount as Address}
          />
        </Link>
      );
    });
  }, [activeProposals, combinedData, showAll, votes]);

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
          <ProposalsListWrapper>{itemsToDisplay}</ProposalsListWrapper>
          {!showAll && combinedData.length > INITIAL_DISPLAY_LIMIT && (
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
