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
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '../../hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from '@lidofinance/lido-ui';

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
        contract[chainId as CHAINS]?.toLowerCase() ===
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
              {proposalStatusInfo.badge.text}
            </Badge>
          )}
        </StatusBadgeWrapper>
        <TimelockWrapper>
          <Box width={200}>
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
            <span>Unknown Сontract Сalled</span>
          </UnknownContract>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
