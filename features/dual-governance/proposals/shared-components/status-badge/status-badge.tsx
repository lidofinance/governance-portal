import { Badge } from 'features/dual-governance/proposals/shared-components/status-badge/style';
import {
  statusBadgeContent,
  statusBadgeVariant,
} from 'features/dual-governance/proposals/shared-components/status-badge/helpers';
import {
  ProposalExtraStatus,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';
import { useProposalTimelock } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useMemo } from 'react';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useDualGovernanceContext } from 'providers/dual-governance';

type Props = {
  proposalStatus: ProposalStatus;
  submittedAt: number;
  scheduledAt: number;
};

export const StatusBadge = ({
  proposalStatus,
  scheduledAt,
  submittedAt,
}: Props) => {
  const proposalTimelock = useProposalTimelock({
    proposalStatus: proposalStatus || null,
    submittedAt: submittedAt,
    scheduledAt: scheduledAt,
  });

  const { visibleState } = useDualGovernanceContext();

  if (!proposalStatus) {
    return null;
  }

  const timelockHasEnded = proposalTimelock?.targetTime
    ? proposalTimelock.targetTime * 1000 < new Date().getTime()
    : false;

  const isReadyToSchedule = useMemo(
    () => proposalStatus === ProposalStatus.Submitted && timelockHasEnded,
    [proposalStatus, timelockHasEnded],
  );

  const isReadyToExecute = useMemo(
    () => proposalStatus === ProposalStatus.Scheduled && timelockHasEnded,
    [proposalStatus, timelockHasEnded],
  );

  if (
    (visibleState === VisibleGovernanceState.BlockedVetoSignalling ||
      visibleState === VisibleGovernanceState.BlockedRageQuit ||
      visibleState === VisibleGovernanceState.BlockedDeactivation) &&
    proposalStatus !== ProposalStatus.Executed &&
    proposalStatus !== ProposalStatus.Scheduled
  ) {
    return (
      <Badge
        $variant={statusBadgeVariant[ProposalExtraStatus.Blocked] || 'default'}
      >
        {statusBadgeContent[ProposalExtraStatus.Blocked]}
      </Badge>
    );
  }

  if (isReadyToSchedule) {
    return (
      <Badge
        $variant={
          statusBadgeVariant[ProposalExtraStatus.ReadyToSchedule] || 'default'
        }
      >
        {statusBadgeContent[ProposalExtraStatus.ReadyToSchedule]}
      </Badge>
    );
  }

  if (isReadyToExecute) {
    return (
      <Badge
        $variant={
          statusBadgeVariant[ProposalExtraStatus.ReadyToExecute] || 'default'
        }
      >
        {statusBadgeContent[ProposalExtraStatus.ReadyToExecute]}
      </Badge>
    );
  }

  return (
    <Badge $variant={statusBadgeVariant[proposalStatus] || 'default'}>
      {statusBadgeContent[proposalStatus]}
    </Badge>
  );
};
