import {
  CommitteeCardHeading,
  CommitteeCardTitle,
  CommitteeCardWrapper,
  ProposalDescription,
  SingersSection,
  ProposalDataSection,
  StyledDGLink,
  StyledAragonLink,
} from './style';
import { PROPOSALS_PATH } from 'constants/urls';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { useMemo } from 'react';
import { Script } from 'features/dual-governance/evm-script-parsed/full';
import { CommitteeProposalSignersInfo } from '../signers-info/committee-proposal-signers-info';

type Props = {
  committeeId: number;
  proposalId: number;
};

export const CommitteeProposalCard = ({ committeeId, proposalId }: Props) => {
  const { proposals } = useDualGovernanceProposalsContext();
  const proposal = useMemo(
    () => proposals.find((proposal) => proposal.id === proposalId),
    [proposalId],
  );

  if (!proposal) {
    return null;
  }

  const { calls } = proposal.proposalDetails;

  return (
    <CommitteeCardWrapper>
      <SingersSection>
        <CommitteeCardHeading>
          <CommitteeCardTitle color="default" size={34}>
            {`Proposal #${proposalId}`}
          </CommitteeCardTitle>
          <StyledDGLink
            target="_blank"
            href={`${PROPOSALS_PATH}/${proposalId}`}
          >
            Open in DG
          </StyledDGLink>
        </CommitteeCardHeading>
        {proposal?.voteId && (
          <ProposalDescription color="primary">
            Submitted from
            <StyledAragonLink href="#">{` Aragon${proposal.voteId}`}</StyledAragonLink>{' '}
            on{' '}
            {
              getDateFromTimestamp({
                timestamp: proposal.proposalDetails.submittedAt,
                showYear: true,
              }).date
            }
          </ProposalDescription>
        )}
        <CommitteeProposalSignersInfo proposalId={proposalId} />
      </SingersSection>
      <ProposalDataSection>
        {calls && calls.length > 0 && (
          <Script
            rawCalls={calls}
            description={proposal.proposalDualGovernanceDetails?.metadata}
          />
        )}
      </ProposalDataSection>
    </CommitteeCardWrapper>
  );
};
