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
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '@dg/hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from 'shared/components/box';
import { DGTooltip } from '@dg/tooltips';
import { Address } from 'viem';
import { ChainAddressMap } from 'shared/blockchain/types';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useProposalEvents } from '@dg/hooks/use-proposal-events';

type Props = {
  id: number;
  calls: SubmitProposalCall[] | undefined;
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

const getAddressFromMap = (
  addressMap: ChainAddressMap | Record<number, string | string[]>,
  chainId: CHAINS,
): Address | undefined => {
  const entry = (addressMap as any)[chainId];
  if (!entry) return undefined;
  if (Array.isArray(entry)) return undefined; // Skip arrays
  return typeof entry === 'string' ? entry : entry.actual;
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
    ? calls.some((call) => {
        const addressMaps = Object.entries(contractAddresses);

        const isKnown = addressMaps.some(([, addressMap]) => {
          const address = getAddressFromMap(addressMap, chainId as CHAINS);

          if (!address) {
            return false;
          }

          return address.toLowerCase() === call.target.toLowerCase();
        });

        return !isKnown;
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
