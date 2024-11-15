import { SearchIcon } from 'shared/components/icons';
import { ProposalPartName } from 'features/dual-governance/proposals/shared-components/proposal-part-name/proposal-part-name';

import { useProposals } from 'features/dual-governance/hooks/use-proposals';

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
  const { data } = useProposals({});

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
        {data?.proposals?.map((proposal, index) => (
          <ProposalsListItem key={index}>
            <ProposalPartName partName={proposal.event.args.metadata} />
            {/*<ProposalStatusBadge status={proposal.status} />*/}
            <ProposalTimeLockCountdownWrapper>
              Timelock ends in{' '}
              <ProposalTimeLockCountdown>14:34:54</ProposalTimeLockCountdown>
            </ProposalTimeLockCountdownWrapper>
            <ProposalDescription>
              {proposal.event.args.metadata}
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
