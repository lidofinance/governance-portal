import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { ProposalsListItem } from './proposals-list-item';
import { InlineLoaderStyled, ProposalSearchItemWrapper } from './style';
import { useEffect, useState } from 'react';
import { useProposal } from 'features/dual-governance/hooks/use-proposal';
import { ProposalCombinedData } from '../types';
import { PROPOSALS_PATH } from 'constants/urls';
import Link from 'next/link';

export const ProposalSearchItem = ({ id }: { id: string }) => {
  const [proposal, setProposal] = useState<ProposalCombinedData | null>(null);

  const { getProposalById } = useDualGovernanceProposalsContext();
  const existingProposal = getProposalById(Number(id));

  const {
    data: proposalData,
    isLoading: isProposalLoading,
    isError: isProposalError,
  } = useProposal({
    id: Number(id),
    enabled: !existingProposal,
  });

  useEffect(() => {
    if (existingProposal) {
      setProposal(existingProposal);
    } else if (proposalData) {
      setProposal(proposalData);
    }
  }, [existingProposal, proposalData]);

  if (isProposalLoading && !proposal) {
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
        <Link href={`${PROPOSALS_PATH}/${proposal.id}`} key={proposal.id}>
          <ProposalsListItem
            id={proposal.id}
            proposer={proposal.aragonProposer}
            description={proposal.proposalDualGovernanceDetails?.metadata || ''}
            calls={proposal.event.args.calls}
            proposalDetails={proposal.proposalDetails}
          />
        </Link>
      </ProposalSearchItemWrapper>
    );
  }

  return null;
};
