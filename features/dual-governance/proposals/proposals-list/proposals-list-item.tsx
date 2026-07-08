import {
  DescriptionText,
  ProposalDescription,
  ProposalListItemWrapper,
  StatusBadgeWrapper,
  SummarySection,
  TimelockWrapper,
  UnknownContract,
} from './style';
import { ProposalName } from '@dg/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData, SubmitProposalCall } from '@dg/proposals/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '@dg/hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from 'shared/components/box';
import { DGTooltip } from '@dg/tooltips';
import { getContractName } from 'utils/get-contract-name';
import { useProposalEvents } from '@dg/hooks/use-proposal-events';

type Props = {
  id: number;
  calls: SubmitProposalCall[] | undefined;
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

export const ProposalsListItem = ({ id, proposalDetails, calls }: Props) => {
  const { chainId } = useLidoSDK();

  const { data: events } = useProposalEvents({ proposalDetails });

  const { status, submittedAt } = proposalDetails;

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: status,
    submittedAt: submittedAt,
    scheduledAt: proposalDetails.scheduledAt,
  });

  const description = events?.proposalSubmittedEvent?.args.metadata ?? '';
  const proposer = events?.proposalSubmittedEvent?.args.proposerAccount;

  const descriptionLines = description.split('\n');

  const isUnknownContractCalled = calls
    ? calls.some((call) => getContractName(chainId, call.target) === null)
    : false;

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={id}
          isUnknownContractCalled={isUnknownContractCalled}
          proposer={proposer}
          chainId={chainId}
        />
        <StatusBadgeWrapper>
          {proposalStatusInfo && proposalStatusInfo.badge && (
            <Badge $variant={proposalStatusInfo.badge.variant}>
              <Box display="flex" alignItems="center" gap={5}>
                {proposalStatusInfo.badge.text}
                {proposalStatusInfo.badge.text === 'Ready to execute' && (
                  <DGTooltip topic="readyToExecute" />
                )}
              </Box>
            </Badge>
          )}
        </StatusBadgeWrapper>
        <TimelockWrapper>
          <Box width={260}>
            {proposalStatusInfo?.info && proposalStatusInfo.info}
          </Box>
        </TimelockWrapper>
      </SummarySection>
      <ProposalDescription>
        {descriptionLines.slice(0, 10).map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
        {isUnknownContractCalled && (
          <UnknownContract>
            <WarningIconTransparent />
            <span>Unknown Contract Called</span>
          </UnknownContract>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
