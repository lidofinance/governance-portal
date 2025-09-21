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
import { Script } from 'features/dual-governance/evm-script-parsed';
import { CommitteeProposalSignersInfo } from '../signers-info/committee-proposal-signers-info';
import { TiebreakerQuorum } from '../tiebreaker-quorum';
import { BaseCall, decodeCalls } from 'utils/decode-evm-script-calls';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  proposalId: number;
  isTiebreaker: boolean;
};

export const CommitteeProposalCard = ({ proposalId, isTiebreaker }: Props) => {
  const { chainId } = useLidoSDK();
  const { proposals } = useDualGovernanceProposalsContext();
  const proposal = useMemo(
    () => proposals.find((proposal) => proposal.proposalId === proposalId),
    [proposalId, proposals],
  );

  if (!proposal) {
    return null;
  }

  const calls = proposal.proposalDetails.calls as BaseCall[];
  const decodedEvmScriptCalls = decodeCalls({ calls: calls, chainId });

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
              decodedCalls={decodedEvmScriptCalls}
              description={proposal?.DGEvent?.args.metadata}
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
              <b>Descriptions</b> of the Aragon proposals may include items that
              fall outside the scope of the Dual Governance
            </Text>
          </Box>
          <Box marginTop={20}>
            <Text color="primary">{proposal.DGEvent?.args?.metadata}</Text>
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
