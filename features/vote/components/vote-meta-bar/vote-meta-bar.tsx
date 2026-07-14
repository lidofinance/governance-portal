import { VoteStatus } from 'shared/votes/types';
import { VoteDoneIcon, VoteFailIcon, InfoIcon } from 'shared/components/icons';
import { VoteDetailsCountdown } from '@vote/components/vote-details-countdown';
import {
  MetaWrap,
  BadgeGroup,
  TimeGroup,
  StatusBadge,
  PhaseBadge,
  PhaseNumber,
  Separator,
  VoteIdText,
  CountdownText,
  EndedText,
  MetaLabel,
  MetaCell,
  PhaseTooltip,
  TooltipText,
  TooltipList,
  TooltipIconWrap,
} from './style';
import { FormattedDate } from 'shared/components/formatted-date';

type Props = {
  voteId: number;
  status: VoteStatus;
  isQuorumReached: boolean;
  voteTime: number;
  objectionPhaseTime: number;
  startDate: number;
  isEnded: boolean;
  dualGovernancePhase?: boolean;
  isDgProposalLoading?: boolean;
  withLabels?: boolean;
};

// Note: timing params are subject to change and must be updated if `Voting.voteTime()` or `Voting.objectionPhaseTime()` changes.
const GOVERNANCE_STAGES = [
  'Main phase — 72h to vote Yes or No.',
  'Objection phase — 48h to vote No or switch Yes to No.',
  'Dual Governance — dynamic timelock that lets stETH holders extend execution delay based on the level of opposition.',
];

const PHASE_TOOLTIP_TITLE = (
  <TooltipText>
    Governance stages:
    <TooltipList>
      {GOVERNANCE_STAGES.map((stage) => (
        <li key={stage}>{stage}</li>
      ))}
    </TooltipList>
  </TooltipText>
);

type StatusLabel = {
  text: string;
  variant: 'active' | 'success' | 'error' | 'warning';
};

type PhaseLabel = {
  text: string;
  variant: 'default' | 'enacted' | 'enactable' | 'phase';
  iconNumber?: number;
} | null;

const getStatusLabel = (
  status: VoteStatus,
  isQuorumReached: boolean,
): StatusLabel => {
  switch (status) {
    case VoteStatus.ActiveMain:
    case VoteStatus.ActiveObjection:
      return { text: 'Active', variant: 'active' };
    case VoteStatus.Rejected:
      return isQuorumReached
        ? { text: 'Rejected', variant: 'error' }
        : { text: 'No quorum', variant: 'warning' };
    default:
      return { text: 'Passed', variant: 'success' };
  }
};

const getPhaseLabel = (
  status: VoteStatus,
  dualGovernancePhase?: boolean,
  isDgProposalLoading?: boolean,
): PhaseLabel => {
  switch (status) {
    case VoteStatus.ActiveMain:
      return { text: 'Main phase', variant: 'phase', iconNumber: 1 };
    case VoteStatus.ActiveObjection:
      return { text: 'Objection phase', variant: 'phase', iconNumber: 2 };
    case VoteStatus.Executed:
      if (isDgProposalLoading) {
        return null;
      }
      return dualGovernancePhase
        ? { text: 'Dual Governance phase', variant: 'phase', iconNumber: 3 }
        : { text: 'Enacted', variant: 'enacted' };
    case VoteStatus.Passed:
    case VoteStatus.Pending:
      return { text: 'Enactable', variant: 'enactable' };
    default:
      return null;
  }
};

export const VoteMetaBar = ({
  voteId,
  status,
  isQuorumReached,
  voteTime,
  objectionPhaseTime,
  startDate,
  isEnded,
  dualGovernancePhase,
  isDgProposalLoading,
  withLabels = false,
}: Props) => {
  const mainPhaseEnd = startDate + (voteTime - objectionPhaseTime);
  const objectionPhaseEnd = startDate + voteTime;
  const endTimestamp = startDate + voteTime;

  const isActive =
    status === VoteStatus.ActiveMain || status === VoteStatus.ActiveObjection;

  const statusLabel = getStatusLabel(status, isQuorumReached);
  const phase = getPhaseLabel(status, dualGovernancePhase, isDgProposalLoading);

  const timeValue = isActive ? (
    <CountdownText data-testid="voteTimer">
      <VoteDetailsCountdown
        voteTime={
          status === VoteStatus.ActiveMain ? mainPhaseEnd : objectionPhaseEnd
        }
        isEndedBeforeTime={isEnded}
      />
    </CountdownText>
  ) : (
    <CountdownText>
      <FormattedDate date={endTimestamp} format="DD MMM YYYY" />
    </CountdownText>
  );

  const timeNodeInline = isActive ? (
    timeValue
  ) : (
    <EndedText data-testid="voteEnded">
      Ended on <FormattedDate date={endTimestamp} format="DD MMM YYYY" />
    </EndedText>
  );

  return (
    <MetaWrap $labeled={withLabels} data-testid="voteHeader">
      <BadgeGroup>
        <StatusBadge $variant={statusLabel.variant} data-testid="voteStatus">
          {statusLabel.variant === 'success' && <VoteDoneIcon />}
          {statusLabel.variant === 'error' && <VoteFailIcon />}
          {statusLabel.variant === 'warning' && <VoteFailIcon />}
          {statusLabel.text}
        </StatusBadge>
        {phase && (
          <PhaseBadge $variant={phase.variant} data-testid="votePhase">
            {phase.iconNumber !== undefined && (
              <PhaseNumber>{phase.iconNumber}</PhaseNumber>
            )}
            {phase.text}
            {phase.variant === 'phase' && (
              <PhaseTooltip placement="bottomRight" title={PHASE_TOOLTIP_TITLE}>
                <TooltipIconWrap>
                  <InfoIcon />
                </TooltipIconWrap>
              </PhaseTooltip>
            )}
          </PhaseBadge>
        )}
      </BadgeGroup>
      <TimeGroup $labeled={withLabels}>
        {withLabels ? (
          <>
            <MetaCell>
              <MetaLabel>Proposal ID</MetaLabel>
              <VoteIdText data-testid="voteId">Vote #{voteId}</VoteIdText>
            </MetaCell>
            {!isActive && (
              <MetaCell data-testid="voteEnded">
                <MetaLabel>Ended on</MetaLabel>
                {timeValue}
              </MetaCell>
            )}
          </>
        ) : (
          <>
            <VoteIdText data-testid="voteId">Vote #{voteId}</VoteIdText>
            <Separator />
            {timeNodeInline}
          </>
        )}
      </TimeGroup>
    </MetaWrap>
  );
};
