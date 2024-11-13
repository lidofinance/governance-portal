import { ProposalStatusBadge } from 'features/dual-governance/proposals/shared-components/proposal-status-badge';
import { SearchIcon } from 'shared/components/icons';
import { ProposalPartName } from 'features/dual-governance/proposals/shared-components/proposal-part-name/proposal-part-name';

import { useProposals } from 'features/dual-governance/hooks/useProposals';

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

// TODO: create and use the countdown component
export const ProposalsPaginatedList = () => {
  const { proposals } = useProposals();

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
        {proposals.map((proposal, index) => (
          <ProposalsListItem key={index}>
            <ProposalPartName partName={proposal.name} />
            <ProposalStatusBadge status={proposal.status} />
            <ProposalTimeLockCountdownWrapper>
              Timelock ends in{' '}
              <ProposalTimeLockCountdown>14:34:54</ProposalTimeLockCountdown>
            </ProposalTimeLockCountdownWrapper>
            <ProposalDescription>{proposal.description}</ProposalDescription>
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
