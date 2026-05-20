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
};

const PHASE_TOOLTIP_TEXT =
  'All proposals go through three stages before implementation: Main phase → Objection phase → Dual Governance phase.';

export const VoteMetaBar = ({
  voteId,
  status,
  isQuorumReached,
  voteTime,
  objectionPhaseTime,
  startDate,
  isEnded,
  dualGovernancePhase,
}: Props) => {
  const mainPhaseEnd = startDate + (voteTime - objectionPhaseTime);
  const objectionPhaseEnd = startDate + voteTime;
  const endTimestamp = startDate + voteTime;

  const isActive =
    status === VoteStatus.ActiveMain || status === VoteStatus.ActiveObjection;

  let statusLabel: {
    text: string;
    variant: 'active' | 'success' | 'error' | 'warning';
  };
  if (isActive) {
    statusLabel = { text: 'Active', variant: 'active' };
  } else if (status === VoteStatus.Rejected) {
    statusLabel = isQuorumReached
      ? { text: 'Rejected', variant: 'error' }
      : { text: 'No quorum', variant: 'warning' };
  } else {
    statusLabel = { text: 'Passed', variant: 'success' };
  }

  let phase: {
    text: string;
    variant: 'default' | 'enacted' | 'enactable' | 'phase';
    iconNumber?: number;
  } | null = null;
  if (status === VoteStatus.ActiveMain) {
    phase = { text: 'Main phase', variant: 'phase', iconNumber: 1 };
  } else if (status === VoteStatus.ActiveObjection) {
    phase = { text: 'Objection phase', variant: 'phase', iconNumber: 2 };
  } else if (dualGovernancePhase && status === VoteStatus.Executed) {
    phase = { text: 'Dual Governance phase', variant: 'phase', iconNumber: 3 };
  } else if (status === VoteStatus.Executed) {
    phase = { text: 'Enacted', variant: 'enacted' };
  } else if (status === VoteStatus.Passed || status === VoteStatus.Pending) {
    phase = { text: 'Enactable', variant: 'enactable' };
  }

  const timeNode = isActive ? (
    <CountdownText>
      <VoteDetailsCountdown
        voteTime={
          status === VoteStatus.ActiveMain ? mainPhaseEnd : objectionPhaseEnd
        }
        isEndedBeforeTime={isEnded}
      />
    </CountdownText>
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
      <TimeGroup>
        <VoteIdText>Vote #{voteId}</VoteIdText>
        <Separator />
        {timeNode}
      </TimeGroup>
    </MetaWrap>
  );
};
