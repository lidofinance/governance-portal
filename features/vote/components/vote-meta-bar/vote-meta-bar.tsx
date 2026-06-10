import { Tooltip } from '@lidofinance/lido-ui';
import { VoteStatus } from 'shared/votes/types';
import { VoteDoneIcon, VoteFailIcon, InfoIcon } from 'shared/components/icons';
import { VoteDetailsCountdown } from '@vote/components/vote-details-countdown';
import { FormattedDate } from '@vote/components/formatted-date';
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
  TooltipText,
  TooltipIconWrap,
} from './style';

type Props = {
  voteId: number;
  status: VoteStatus;
  isQuorumReached: boolean;
  voteTime: number;
  objectionPhaseTime: number;
  startDate: number;
  isEnded: boolean;
  dualGovernancePhase?: boolean;
  withLabels?: boolean;
};

const PHASE_TOOLTIP_TEXT =
  'All proposals go through three stages before implementation: Main phase → Objection phase → Dual Governance phase.';

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
): PhaseLabel => {
  switch (status) {
    case VoteStatus.ActiveMain:
      return { text: 'Main phase', variant: 'phase', iconNumber: 1 };
    case VoteStatus.ActiveObjection:
      return { text: 'Objection phase', variant: 'phase', iconNumber: 2 };
    case VoteStatus.Executed:
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
  withLabels = false,
}: Props) => {
  const mainPhaseEnd = startDate + (voteTime - objectionPhaseTime);
  const objectionPhaseEnd = startDate + voteTime;
  const endTimestamp = startDate + voteTime;

  const isActive =
    status === VoteStatus.ActiveMain || status === VoteStatus.ActiveObjection;

  const statusLabel = getStatusLabel(status, isQuorumReached);
  const phase = getPhaseLabel(status, dualGovernancePhase);

  const activePhaseLabel =
    status === VoteStatus.ActiveMain
      ? 'Main phase ends in'
      : 'Objection phase ends in';

  const timeValue = isActive ? (
    <CountdownText>
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
    <EndedText>
      Ended on <FormattedDate date={endTimestamp} format="DD MMM YYYY" />
    </EndedText>
  );

  return (
    <MetaWrap>
      <BadgeGroup>
        <StatusBadge $variant={statusLabel.variant}>
          {statusLabel.variant === 'success' && <VoteDoneIcon />}
          {statusLabel.variant === 'error' && <VoteFailIcon />}
          {statusLabel.variant === 'warning' && <VoteFailIcon />}
          {statusLabel.text}
        </StatusBadge>
        {phase && (
          <PhaseBadge $variant={phase.variant}>
            {phase.iconNumber !== undefined && (
              <PhaseNumber>{phase.iconNumber}</PhaseNumber>
            )}
            {phase.text}
            {phase.variant === 'phase' && (
              <Tooltip title={<TooltipText>{PHASE_TOOLTIP_TEXT}</TooltipText>}>
                <TooltipIconWrap>
                  <InfoIcon />
                </TooltipIconWrap>
              </Tooltip>
            )}
          </PhaseBadge>
        )}
      </BadgeGroup>
      <TimeGroup $labeled={withLabels}>
        {withLabels ? (
          <>
            <MetaCell>
              <MetaLabel>Proposal ID</MetaLabel>
              <VoteIdText>Vote #{voteId}</VoteIdText>
            </MetaCell>
            <MetaCell>
              <MetaLabel>{isActive ? activePhaseLabel : 'Ended on'}</MetaLabel>
              {timeValue}
            </MetaCell>
          </>
        ) : (
          <>
            <VoteIdText>Vote #{voteId}</VoteIdText>
            <Separator />
            {timeNodeInline}
          </>
        )}
      </TimeGroup>
    </MetaWrap>
  );
};
