import { VoteStatus } from 'shared/votes/types';
import { VoteDoneIcon, VoteFailIcon, InfoIcon } from 'shared/components/icons';
import { VoteDetailsCountdown } from '@vote/components/vote-details-countdown';
import {
  MetaWrap,
  BadgeGroup,
  TimeGroup,
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
import { Badge, BadgeVariant } from 'shared/components/badge';

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
  variant: BadgeVariant;
  icon?: React.ReactNode;
};

type PhaseLabel = {
  text: string;
  variant: BadgeVariant;
  iconNumber?: number;
} | null;

const getStatusLabel = (
  status: VoteStatus,
  isQuorumReached: boolean,
): StatusLabel => {
  switch (status) {
    case VoteStatus.ActiveMain:
    case VoteStatus.ActiveObjection:
      return { text: 'Active', variant: 'yellow' };
    case VoteStatus.Rejected:
      return isQuorumReached
        ? { text: 'Rejected', variant: 'red', icon: <VoteFailIcon /> }
        : { text: 'No quorum', variant: 'yellow', icon: <VoteFailIcon /> };
    default:
      return { text: 'Passed', variant: 'green', icon: <VoteDoneIcon /> };
  }
};

const getPhaseLabel = (
  status: VoteStatus,
  dualGovernancePhase?: boolean,
  isDgProposalLoading?: boolean,
): PhaseLabel => {
  switch (status) {
    case VoteStatus.ActiveMain:
      return { text: 'Main phase', variant: 'blue', iconNumber: 1 };
    case VoteStatus.ActiveObjection:
      return { text: 'Objection phase', variant: 'blue', iconNumber: 2 };
    case VoteStatus.Executed:
      if (isDgProposalLoading) {
        return null;
      }
      return dualGovernancePhase
        ? { text: 'Dual Governance phase', variant: 'blue', iconNumber: 3 }
        : { text: 'Enacted', variant: 'green' };
    case VoteStatus.Passed:
    case VoteStatus.Pending:
      return { text: 'Enactable', variant: 'yellow' };
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
        <Badge
          variant={statusLabel.variant}
          leftIcon={statusLabel.icon}
          data-testid="voteStatus"
        >
          {statusLabel.text}
        </Badge>
        {phase && (
          <Badge
            variant={phase.variant}
            leftIcon={
              phase.iconNumber !== undefined && (
                <PhaseNumber>{phase.iconNumber}</PhaseNumber>
              )
            }
            rightIcon={
              phase.variant === 'blue' && (
                <PhaseTooltip
                  placement="bottomRight"
                  title={PHASE_TOOLTIP_TITLE}
                >
                  <TooltipIconWrap>
                    <InfoIcon />
                  </TooltipIconWrap>
                </PhaseTooltip>
              )
            }
            data-testid="votePhase"
          >
            {phase.text}
          </Badge>
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
