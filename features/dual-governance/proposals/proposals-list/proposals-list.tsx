import { ProposalsListItem } from 'features/dual-governance/proposals/proposals-list/proposals-list-item';
import {
  InlineLoaderStyled,
  ListItemLink,
  ProposalsListWrapper,
  ShowMoreWrapper,
} from 'features/dual-governance/proposals/proposals-list/style';
import { Button } from 'shared/components/button';
import { memo, useCallback, useMemo, useState } from 'react';
import { useProposalsCount } from '../../hooks/use-proposals-count';
import { Box } from 'shared/components/box';
import { useVotes } from 'shared/votes/hooks/use-votes';
import { VoteItem } from './vote-item';
import { config } from 'config';
import { PROPOSALS_PATH } from 'constants/urls';
import { useActiveProposals } from '../../hooks/use-active-proposals';

const INITIAL_DISPLAY_LIMIT = 4;
const VOTES_LIMIT = 15;

export const ProposalsList = memo(() => {
  const { data: proposalsCount, isLoading: isProposalsCountLoading } =
    useProposalsCount();

  const { data: activeProposalsIds, isLoading: isActiveProposalsLoading } =
    useActiveProposals({ proposalsCount });

  const { data: votesData, isFetching: isVotesFetching } = useVotes({
    limit: VOTES_LIMIT,
    shouldGetActive: true,
  });

  const proposalsIds = useMemo(() => {
    if (Number(proposalsCount) === 0) return [] as number[];
    return Array.from(
      { length: Number(proposalsCount) },
      (_, i) => i + 1,
    ).reverse();
  }, [proposalsCount]);

  const initialProposalsIdsToDisplay = useMemo(() => {
    const activeProposalsCount = activeProposalsIds?.length || 0;
    const activeVotesCount = votesData?.votes?.length || 0;
    const totalActiveCount = activeProposalsCount + activeVotesCount;

    if (totalActiveCount >= INITIAL_DISPLAY_LIMIT) {
      return proposalsIds.slice(0, activeProposalsCount);
    } else {
      const proposalsToShow = Math.max(
        0,
        INITIAL_DISPLAY_LIMIT - activeVotesCount,
      );
      return proposalsIds.slice(0, proposalsToShow);
    }
  }, [proposalsIds, activeProposalsIds, votesData?.votes]);

  const restProposalsIdsToDisplay = useMemo(() => {
    const activeProposalsCount = activeProposalsIds?.length || 0;
    const activeVotesCount = votesData?.votes?.length || 0;
    const totalActiveCount = activeProposalsCount + activeVotesCount;

    if (totalActiveCount >= INITIAL_DISPLAY_LIMIT) {
      return proposalsIds.slice(activeProposalsCount);
    } else {
      const proposalsToShow = Math.max(
        0,
        INITIAL_DISPLAY_LIMIT - activeVotesCount,
      );
      return proposalsIds.slice(proposalsToShow);
    }
  }, [proposalsIds, activeProposalsIds, votesData?.votes]);

  const [showMore, setShowMore] = useState(false);

  const handleLoadMore = useCallback(() => {
    setShowMore(true);
  }, []);

  return (
    <>
      {isProposalsCountLoading || isActiveProposalsLoading ? (
        <>
          <Box display="flex" gap={20}>
            <InlineLoaderStyled />
            <InlineLoaderStyled />
          </Box>
          <Box display="flex" gap={20}>
            <InlineLoaderStyled />
            <InlineLoaderStyled />
          </Box>
        </>
      ) : (
        <>
          <ProposalsListWrapper>
            {votesData?.votes &&
              votesData.votes.length > 0 &&
              !isVotesFetching && (
                <>
                  {votesData.votes.map((dataItem, index) => (
                    <ListItemLink
                      href={`${config.voteOrigin}/vote/${dataItem.voteId}`}
                      key={`vote-${dataItem.voteId}-${index}`}
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
                    </ListItemLink>
                  ))}
                </>
              )}
            {initialProposalsIdsToDisplay.map((proposalId, index) => (
              <ListItemLink
                href={`${PROPOSALS_PATH}/${proposalId}`}
                key={`proposal-${proposalId}-${index}`}
                target="_self"
              >
                <ProposalsListItem proposalId={proposalId} />
              </ListItemLink>
            ))}

            {showMore &&
              restProposalsIdsToDisplay.map((proposalId, index) => (
                <ListItemLink
                  href={`${PROPOSALS_PATH}/${proposalId}`}
                  key={`proposal-${proposalId}-${index}`}
                  target="_self"
                >
                  <ProposalsListItem proposalId={proposalId} />
                </ListItemLink>
              ))}
          </ProposalsListWrapper>
          <ShowMoreWrapper>
            {restProposalsIdsToDisplay.length > 0 && !showMore && (
              <Button variant="outlined" onClick={handleLoadMore}>
                Show more
              </Button>
            )}
          </ShowMoreWrapper>
        </>
      )}
    </>
  );
});
