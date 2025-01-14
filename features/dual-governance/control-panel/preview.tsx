import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from 'shared/components/button';
import { Text } from 'shared/components/text';

import {
  ControlPanelWrapper,
  PreviewControls,
  PreviewProposalList,
  Description,
  ProposalWrapper,
  VoteWrapper,
  InlineLoaderStyled,
  IconWrapper,
} from './style';
import { useAccount } from 'wagmi';
import { ConnectWalletButton } from 'shared/wallet';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { isVoteItem, VisibleGovernanceState } from '../types';
import { ProposalsIcon, AragonLogo } from 'shared/components/icons';
import { ProposalCombinedData, ProposalStatus } from '../proposals/types';
import { useProposalTimelock } from '../hooks/use-proposal-timelock';
import { VoteData } from 'shared/votes/types';
import { config } from 'config';
import { PROPOSALS_PATH } from 'constants/urls';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useDualGovernanceConfig } from '../hooks/use-dual-governance-config';
import { DGTooltip } from '../tooltips';
import { FlexWrapper } from 'shared/styled-components';

const PROPOSALS_TO_SHOW = 3;

type Props = {
  onContinue: () => void;
};

const ActiveProposalWrapper = ({
  proposalId,
  children,
}: {
  proposalId: number;
  children: ReactNode;
}) => {
  return (
    <ProposalWrapper>
      <IconWrapper>
        <ProposalsIcon />
      </IconWrapper>
      <Text size={22}>
        <Link href={`${PROPOSALS_PATH}/${proposalId}`}>
          {`Proposal #${proposalId} `}
        </Link>
        &mdash;
      </Text>
      <Text as="div" size={22}>
        {children}
      </Text>
    </ProposalWrapper>
  );
};

const ActiveProposal = ({
  proposal,
}: {
  proposal: ProposalCombinedData | VoteData;
}) => {
  const isVote = isVoteItem(proposal);

  const { data: dgConfig } = useDualGovernanceConfig();
  const { visibleState, detailedState } = useDualGovernanceContext();
  const vetoSignallingDeactivationMaxDuration =
    dgConfig?.vetoSignallingDeactivationMaxDuration;

  const deactivationTargetTimestamp =
    detailedState?.persistedStateEnteredAt &&
    vetoSignallingDeactivationMaxDuration
      ? detailedState.persistedStateEnteredAt +
        vetoSignallingDeactivationMaxDuration
      : 0;

  const deactivationDate = getDateFromTimestamp({
    timestamp: deactivationTargetTimestamp,
    showYear: true,
  });

  if (isVote) {
    return (
      <VoteWrapper>
        <AragonLogo />
        <Text size={22}>
          <Link href={`${config.voteOrigin}/vote/${proposal.id}`}>
            {`LDO Vote #${proposal.id} `}
          </Link>
          &mdash; Not submitted to Dual Governance yet
        </Text>
      </VoteWrapper>
    );
  }

  const { status, submittedAt, scheduledAt } = proposal.proposalDetails;

  const timelockData = useProposalTimelock({
    proposalStatus: status,
    submittedAt,
    scheduledAt,
  });

  const targetTime = timelockData?.targetTime;
  let dateString;
  let timelockHasPassed = false;

  if (targetTime) {
    const dateObj = getDateFromTimestamp({ timestamp: targetTime });
    timelockHasPassed = dateObj.hasPassed;

    dateString = (
      <span>
        <b>{dateObj.date}</b> {dateObj.tz}
      </span>
    );
  }

  if (
    visibleState === VisibleGovernanceState.BlockedVetoSignalling ||
    visibleState === VisibleGovernanceState.BlockedRageQuit
  ) {
    return (
      <ActiveProposalWrapper proposalId={proposal.id}>
        <span>Blocked</span>
      </ActiveProposalWrapper>
    );
  }

  if (visibleState === VisibleGovernanceState.BlockedDeactivation) {
    return (
      <ActiveProposalWrapper proposalId={proposal.id}>
        <span>
          Blocked until <b>{deactivationDate.date}</b> {deactivationDate.tz}
        </span>
      </ActiveProposalWrapper>
    );
  }

  switch (status) {
    case ProposalStatus.Submitted:
      if (timelockHasPassed) {
        return (
          <ActiveProposalWrapper proposalId={proposal.id}>
            <span>Ready to schedule</span>
          </ActiveProposalWrapper>
        );
      } else {
        return (
          <ActiveProposalWrapper proposalId={proposal.id}>
            <span>{' Veto possible until '}</span>
            {dateString}
          </ActiveProposalWrapper>
        );
      }
    case ProposalStatus.Scheduled:
      if (timelockHasPassed) {
        return (
          <ActiveProposalWrapper proposalId={proposal.id}>
            <FlexWrapper $gap="6px" $alignItems="flex-start">
              <span>Ready to Execute</span>
              <DGTooltip topic="readyToExecute" />
            </FlexWrapper>
          </ActiveProposalWrapper>
        );
      } else {
        return (
          <ActiveProposalWrapper proposalId={proposal.id}>
            <div>
              <span>{' Emergency Committee may stop execution until '}</span>
              {dateString}
            </div>
          </ActiveProposalWrapper>
        );
      }
  }
};

export const DualGovernanceControlPanelPreview = ({ onContinue }: Props) => {
  const { isConnected } = useAccount();
  const { votes, activeProposals, isLoading } =
    useDualGovernanceProposalsContext();
  const votesProposalsList = [...votes, ...activeProposals];

  const restProposalsAmount = votesProposalsList.length - PROPOSALS_TO_SHOW;

  return (
    <ControlPanelWrapper>
      <Text size={22} weight={600}>
        Active Proposals:
      </Text>
      {isLoading && <InlineLoaderStyled />}
      {!isLoading && (
        <>
          {votesProposalsList.length > 0 && (
            <PreviewProposalList>
              {votesProposalsList
                .map((proposal) => (
                  <ActiveProposal key={proposal.id} proposal={proposal} />
                ))
                .slice(0, PROPOSALS_TO_SHOW)}
              {restProposalsAmount > 0 && (
                <Text>And {restProposalsAmount} more</Text>
              )}
            </PreviewProposalList>
          )}
          {votesProposalsList.length === 0 && (
            <>
              <br />
              <Text>No active proposals</Text>
            </>
          )}
        </>
      )}
      <Description>
        Support Veto with your stETH to help block all proposals execution
        temporarily (VetoSignaling <DGTooltip topic="vetoSignalling" />) or
        withdraw your stETH before execution (RageQuit{' '}
        <DGTooltip topic="rageQuit" />
        ).
      </Description>
      <PreviewControls>
        {isConnected ? (
          <Button size="lg" onClick={onContinue}>
            Go to Veto Support
          </Button>
        ) : (
          <ConnectWalletButton size="lg">Connect wallet</ConnectWalletButton>
        )}
      </PreviewControls>
    </ControlPanelWrapper>
  );
};
