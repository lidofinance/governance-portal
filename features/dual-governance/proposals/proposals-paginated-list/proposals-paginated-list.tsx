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
} from 'features/dual-governance/proposals/proposals-paginated-list/style';
import { useMergedProposalsAndVotes } from 'features/dual-governance/hooks/use-merged-proposals-and-votes';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';

// TODO: create and use the countdown component
export const ProposalsPaginatedList = () => {
  const { mergedList, isLoading } = useMergedProposalsAndVotes();

  if (isLoading) {
    return <div>Skeleton loading...</div>;
  }
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
        {mergedList.map((item, index) => (
          <ProposalsListItem key={index}>
            <ProposalName voteId={item.voteId} isAragon={item.isVote} />
            <StatusBadge
              isAragon={item.isVote}
              voteState={item.isVote ? item.state : undefined}
              proposalStatus={
                !item.isVote ? item.proposalInfo[0].status : undefined
              }
            />
            <ProposalTimeLockCountdownWrapper>
              Timelock ends in{' '}
              <ProposalTimeLockCountdown>14:34:54</ProposalTimeLockCountdown>
            </ProposalTimeLockCountdownWrapper>
            <ProposalDescription>
              {item.isVote ? item.event.metadata : item.event.args.metadata}
            </ProposalDescription>
          </ProposalsListItem>
        ))}
      </ProposalsListGrid>
      <StyledPagination
        onItemClick={function noRefCheck() {}}
        pagesCount={10}
        siblingCount={1}
      />
    </ProposalsListContainer>
  );
};
