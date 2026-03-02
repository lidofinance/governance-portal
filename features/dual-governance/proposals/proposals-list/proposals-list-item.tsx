import {
  DescriptionText,
  InlineLoaderDescription,
  ProposalDescription,
  ProposalListItemWrapper,
  StatusBadgeWrapper,
  SummarySection,
  TimelockWrapper,
  UnknownContract,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import * as contractAddresses from 'shared/blockchain/contract-addresses';
import { ChainAddressMap } from 'shared/blockchain/types';
import { useLidoSDK } from 'providers/lido-sdk';
import { WarningIconTransparent } from 'shared/components/icons';
import { useProposalStatus } from '../../hooks/use-proposal-status';
import { Badge } from '../shared-components/vote-status-badge/style';
import { Box } from 'shared/components/box';
import { DGTooltip } from '../../tooltips';
import { Address } from 'viem';
import { useProposalDetails } from '../../hooks/use-proposal-details';
import { useProposalEvents } from '../../hooks/use-proposal-events';
import { useMemo, memo } from 'react';

type Props = {
  proposalId: number;
};

export const ProposalsListItem = memo(({ proposalId }: Props) => {
  const { data: proposalDetails } = useProposalDetails(proposalId);

  const { chainId } = useLidoSDK();

  const { data, isLoading } = useProposalEvents({ proposalDetails });

  const proposalStatusInfo = useProposalStatus({
    proposalStatus: proposalDetails?.status,
    submittedAt: proposalDetails?.submittedAt,
    scheduledAt: proposalDetails?.scheduledAt,
  });

  const proposalDescription = useMemo(() => {
    const metadata = data?.proposalSubmittedEvent?.args?.metadata;
    if (!metadata) {
      return [] as string[];
    }
    return metadata.split('\n');
  }, [data?.proposalSubmittedEvent?.args?.metadata]);

  const isUnknownContractCalled = useMemo(() => {
    if (!proposalDetails?.calls) return false;
    const contractAddressValues = Object.values(contractAddresses) as ChainAddressMap[];
    return proposalDetails.calls.some((call) => {
      return !contractAddressValues.some((contract) => {
        const raw = contract[chainId];
        const resolved =
          raw && typeof raw === 'object' ? raw.actual : raw;
        return resolved?.toLowerCase() === call.target.toLowerCase();
      });
    });
  }, [proposalDetails?.calls, chainId]);

  const proposerAddress = data?.proposalSubmittedEvent?.args
    ?.proposerAccount as Address | null;

  if (!proposalDetails) {
    return null;
  }

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={Number(proposalDetails.id)}
          isUnknownContractCalled={isUnknownContractCalled}
          chainId={chainId}
          proposer={proposerAddress}
        />
        <StatusBadgeWrapper>
          {proposalStatusInfo?.badge && (
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
          <Box width={260}>{proposalStatusInfo?.info}</Box>
        </TimelockWrapper>
      </SummarySection>
      <ProposalDescription>
        {isLoading ? (
          <>
            <InlineLoaderDescription />
            <InlineLoaderDescription />
          </>
        ) : (
          <>
            {proposalDescription.slice(0, 10).map((line, index) => (
              <DescriptionText key={index}>{line}</DescriptionText>
            ))}
            {isUnknownContractCalled && (
              <UnknownContract>
                <WarningIconTransparent />
                <span>Unknown Contract Called</span>
              </UnknownContract>
            )}
          </>
        )}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
});
