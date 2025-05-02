import {
  DescriptionText,
  ProposalDescription,
  ProposalListItemWrapper,
  StatusBadgeWrapper,
  SummarySection,
  TimelockWrapper,
  UnknownContract,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { CHAINS } from '@lido-sdk/constants';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '../../hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from 'shared/components/box';
import { DGTooltip } from '../../tooltips';

type Props = {
  id: number;
  description: string;
  calls: any[];
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

export const ProposalsListItem = ({
  id,
  description,
  proposalDetails,
  calls,
}: Props) => {
  const { chainId } = useLidoSDK();

  const { status, submittedAt } = proposalDetails;

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: status,
    submittedAt: submittedAt,
    scheduledAt: proposalDetails.scheduledAt,
  });

  const descriptionLines = description.split('\n');

  const isUnknownContractCalled = calls.some((call) => {
    return !Object.values(contractAddresses).some(
      (contract) =>
        contract[chainId as unknown as CHAINS]?.toLowerCase() ===
        call.target.toLowerCase(),
    );
  });

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={id}
          isUnknownContractCalled={isUnknownContractCalled}
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
        {descriptionLines.map((line, index) => (
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
