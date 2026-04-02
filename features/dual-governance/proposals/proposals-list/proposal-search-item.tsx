import { ProposalsListItem } from './proposals-list-item';
import { InlineLoaderStyled, ProposalSearchItemWrapper } from './style';
import { PROPOSALS_PATH } from 'constants/urls';
import Link from 'next/link';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';

export const ProposalSearchItem = ({ id }: { id: string }) => {
  const {
    getProposalById,
    isLoading: isProposalsLoading,
    isError: isProposalsError,
  } = useDualGovernanceProposalsContext();

  const proposal = getProposalById(Number(id));

  if (isProposalsLoading && !proposal) {
    return <InlineLoaderStyled />;
  }

  if (isProposalsError) {
    return (
      <ProposalSearchItemWrapper>
        <h1>No proposal found</h1>
      </ProposalSearchItemWrapper>
    );
  }

  if (proposal) {
    return (
      <ProposalSearchItemWrapper>
        <Link
          href={`${PROPOSALS_PATH}/${proposal.proposalId}`}
          key={proposal.proposalId}
        >
          <ProposalsListItem
            id={proposal.proposalId}
            calls={proposal.proposalDetails?.calls}
            proposalDetails={proposal.proposalDetails}
          />
        </Link>
      </ProposalSearchItemWrapper>
    );
  }

  return null;
};
