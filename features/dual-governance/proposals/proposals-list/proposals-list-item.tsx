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
import {
  ProposalCombinedData,
  SubmitProposalCall,
} from 'features/dual-governance/proposals/types';
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '../../hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from 'shared/components/box';
import { DGTooltip } from '../../tooltips';
import { Address } from 'viem';
import { getContractAddress } from 'shared/blockchain/get-contract-address';

type Props = {
  id: number;
  description: string;
  calls: SubmitProposalCall[] | undefined;
  proposalDetails: ProposalCombinedData['proposalDetails'];
  proposer?: Address;
};

export const ProposalsListItem = ({
  id,
  description,
  proposalDetails,
  calls,
  proposer,
}: Props) => {
  const { chainId } = useLidoSDK();

  const { status, submittedAt } = proposalDetails;

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: status,
    submittedAt: submittedAt,
    scheduledAt: proposalDetails.scheduledAt,
  });

  const descriptionLines = description.split('\n');

  const isUnknownContractCalled = calls
    ? calls.some((call) => {
        const contractNames = Object.keys(contractAddresses);

        return !contractNames.some((contractName) => {
          const address = getContractAddress(contractName as any, chainId);
          return address?.toLowerCase() === call.target.toLowerCase();
        });
      })
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
        {descriptionLines.splice(0, 10).map((line, index) => (
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
