import { Box } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import {
  CommitteeCardHeading,
  CommitteeCardWrapper,
  StyledAragonLink,
  StyledDGLink,
} from './style';
import { PROPOSALS_PATH } from 'constants/urls';
import { CommitteeProposalSignersInfo } from '../signers-info/committee-proposal-signers-info';
import { TiebreakerQuorum } from '../tiebreaker-quorum';
import { useProposalDetails } from 'features/dual-governance/hooks/use-proposal-details';
import { Script } from 'features/dual-governance/evm-script-parsed';
import { useProposalEvents } from 'features/dual-governance/hooks/use-proposal-events';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { Voting } from 'shared/blockchain/contracts';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { decodeCalls, BaseCall } from 'utils/decode-evm-script-calls';
import { useMemo } from 'react';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  proposalId: number;
  isTiebreaker: boolean;
};

export const CommitteeProposalCard = ({ proposalId, isTiebreaker }: Props) => {
  const { data: proposalDetails } = useProposalDetails(proposalId);
  const { data: proposalEvents } = useProposalEvents({
    proposalDetails,
  });

  const aragonAddress = useContractAddress(Voting);
  const { chainId } = useLidoSDK();

  const decodedCalls = useMemo(
    () =>
      proposalDetails?.calls
        ? decodeCalls({ calls: proposalDetails.calls as BaseCall[], chainId })
        : [],
    [proposalDetails?.calls, chainId],
  );

  if (!proposalDetails) {
    return null;
  }

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
        {proposalEvents?.proposalSubmittedEvent?.args.proposerAccount ===
          aragonAddress && (
          <Box>
            <Text color="primary">
              Submitted from
              <StyledAragonLink href="#">{` Aragon${proposalId}`}</StyledAragonLink>{' '}
              on{' '}
              {
                getDateFromTimestamp({
                  timestamp: proposalDetails?.submittedAt,
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
          {proposalDetails?.calls && proposalDetails?.calls.length > 0 && (
            <Script
              decodedCalls={decodedCalls}
              metadata={
                proposalEvents?.proposalSubmittedEvent?.args.metadata
              }
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
            <Text color="primary">
              {proposalEvents?.proposalSubmittedEvent?.args?.metadata}
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
