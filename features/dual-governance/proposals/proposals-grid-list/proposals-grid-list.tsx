import { SearchIcon } from 'shared/components/icons';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';

import {
  ProposalsListContainer,
  ProposalsListHeader,
  Heading,
  StyledSearchInput,
  ProposalsListGrid,
  ProposalsListItem,
  ProposalTimeLockCountdownWrapper,
  ProposalTimeLockCountdown,
  ProposalDescription,
  StyledPagination,
} from 'features/dual-governance/proposals/proposals-grid-list/style';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VoteData } from 'shared/votes/hooks/use-active-votes';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { useState } from 'react';
import { useProposals } from 'features/dual-governance/hooks/use-proposals';
import { useRouter } from 'next/router';

const isVoteItem = (
  item: ProposalCombinedData | VoteData,
): item is VoteData => {
  return 'vote' in item;
};

const itemsPerPage = 2;

// TODO: create and use the countdown component
export const ProposalsGridList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useProposals({
    currentPage: currentPage,
    itemsPerPage: itemsPerPage,
  });
  const router = useRouter();
  const { query } = router;

  const pagesCount = Math.ceil(Number(data?.proposalsCount) / itemsPerPage);

  if (isLoading) {
    return <div>Skeleton loading...</div>;
  }

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);

    await router.push(
      {
        pathname: router.pathname,
        query: { ...query, page },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <ProposalsListContainer>
      <ProposalsListHeader>
        <Heading>Dual Governance Proposals</Heading>
        <StyledSearchInput
          leftDecorator={<SearchIcon />}
          placeholder="Search proposal by number"
        />
      </ProposalsListHeader>
      <ProposalsListGrid>
        {data?.proposals.map((item, index) => (
          <ProposalsListItem key={index}>
            <ProposalName id={item.id} isAragon={isVoteItem(item)} />
            <StatusBadge
              isAragon={isVoteItem(item)}
              voteState={isVoteItem(item) ? item.state : undefined}
              proposalStatus={
                !isVoteItem(item) ? item.proposalInfo[0].status : undefined
              }
            />
            <ProposalTimeLockCountdownWrapper>
              Timelock ends in{' '}
              <ProposalTimeLockCountdown>14:34:54</ProposalTimeLockCountdown>
            </ProposalTimeLockCountdownWrapper>
            <ProposalDescription>
              {isVoteItem(item)
                ? item.event?.metadata
                : item.event.args.metadata}
            </ProposalDescription>
          </ProposalsListItem>
        ))}
      </ProposalsListGrid>
      {data && Number(data.proposalsCount) && (
        <StyledPagination
          activePage={currentPage}
          onItemClick={handlePageChange}
          pagesCount={pagesCount}
          siblingCount={1}
        />
      )}
    </ProposalsListContainer>
  );
};
