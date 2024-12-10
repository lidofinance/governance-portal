import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { ProposalsListItem } from './proposals-list-item';
import { InlineLoaderStyled, ProposalSearchItemWrapper } from './style';
import { useEffect } from 'react';

export const ProposalSearchItem = ({ id }: { id: string }) => {
  const {
    proposalId,
    setProposalId,
    proposal,
    isFetching,
    isProposalError,
    openProposalPage,
  } = useDualGovernanceProposalsContext();

  useEffect(() => {
    if (Number(id) !== Number(proposalId)) {
      setProposalId(Number(id));
    }
  }, [id, proposalId, setProposalId]);

  if (isFetching) {
    return <InlineLoaderStyled />;
  }

  if (isProposalError) {
    return (
      <ProposalSearchItemWrapper>
        <h1>No proposal found</h1>
      </ProposalSearchItemWrapper>
    );
  }

  if (proposal) {
    return (
      <ProposalSearchItemWrapper>
        <ProposalsListItem
          id={proposal.id}
          description={proposal.event.args.metadata}
          calls={proposal.event.args.calls}
          proposalInfo={proposal.proposalInfo}
          onProposalClick={() =>
            openProposalPage({ id: proposal.id, isVote: false })
          }
        />
      </ProposalSearchItemWrapper>
    );
  }
};
