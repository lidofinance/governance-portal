import { useMemo } from 'react';
import { Box } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import {
  CommitteeCardHeading,
  CommitteeCardWrapper,
  StyledDGLink,
  StyledAragonLink,
} from './style';
import { PROPOSALS_PATH } from 'constants/urls';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { Script } from 'features/dual-governance/evm-script-parsed/full';
import { CommitteeProposalSignersInfo } from '../signers-info/committee-proposal-signers-info';
import { TiebreakerQuorum } from '../tiebreaker-quorum';

type Props = {
  proposalId: number;
  isTiebreaker: boolean;
};

export const CommitteeProposalCard = ({ proposalId, isTiebreaker }: Props) => {
  const { proposals } = useDualGovernanceProposalsContext();
  const proposal = useMemo(
    () => proposals.find((proposal) => proposal.id === proposalId),
    [proposalId, proposals],
  );

  if (!proposal) {
    return null;
  }

  const { calls } = proposal.proposalDetails;

  return (
    <CommitteeCardWrapper>
      <Box flexShrink="0">
        <CommitteeCardHeading>
          <Text color="default" size={34} weight={600}>
            {`Proposal #${proposalId}`}
          </Text>
          {!isTiebreaker && (
            <StyledDGLink
              target="_blank"
              href={`${PROPOSALS_PATH}/${proposalId}`}
            >
              Open in DG
            </StyledDGLink>
          )}
        </CommitteeCardHeading>
        {proposal?.voteId && (
          <Box>
            <Text color="primary">
              Submitted from
              <StyledAragonLink href="#">{` Aragon${proposal.voteId}`}</StyledAragonLink>{' '}
              on{' '}
              {
                getDateFromTimestamp({
                  timestamp: proposal.proposalDetails.submittedAt,
                  showYear: true,
                }).date
              }
            </Text>
          </Box>
        )}
        {isTiebreaker && (
          <Box marginTop={40}>
            <TiebreakerQuorum />
          </Box>
        )}
        {!isTiebreaker && <CommitteeProposalSignersInfo />}
      </Box>
      {!isTiebreaker && (
        <Box width="50%">
          {calls && calls.length > 0 && (
            <Script
              rawCalls={calls}
              description={proposal.proposalDualGovernanceDetails?.metadata}
            />
          )}
        </Box>
      )}
      {isTiebreaker && (
        <Box width="100%">
          <Text size={22} weight={600}>
            Description
          </Text>
          <Box marginTop={10}>
            <Text color="secondary">
              <b>Disclaimer:</b> Description provided by the Aragon proposal
              author; may include items not under Dual Governance
            </Text>
          </Box>
          <Box marginTop={20}>
            <Text color="primary">
              {proposal.proposalDualGovernanceDetails?.metadata}
            </Text>
          </Box>
          <br />
          <StyledDGLink
            target="_blank"
            href={`${PROPOSALS_PATH}/${proposalId}`}
          >
            Open Full Proposal in Dual Governance
          </StyledDGLink>
        </Box>
      )}
    </CommitteeCardWrapper>
  );
};
