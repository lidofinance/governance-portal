import { BadgeVariant } from 'features/dual-governance/proposals/shared-components/status-badge/types';
import { VoteStatus } from 'shared/votes/types';
import {
  ProposalExtraStatus,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';

export const statusBadgeContent = {
  [ProposalStatus.NotExist]: 'Not Exist',
  [ProposalStatus.Submitted]: 'Pending in Dual Governance',
  [ProposalStatus.Scheduled]: 'Pending in Dual Governance',
  [ProposalStatus.Executed]: 'Executed',
  [ProposalStatus.Cancelled]: 'Cancelled',
  [ProposalExtraStatus.ReadyToSchedule]: 'Ready to schedule',
  [ProposalExtraStatus.ReadyToExecute]: 'Ready to execute',
  [ProposalExtraStatus.Blocked]: 'Blocked',
} as const;

export const statusBadgeVariant = {
  [ProposalStatus.Submitted]: 'warning',
  [ProposalStatus.Scheduled]: 'warning',
  [ProposalStatus.Executed]: 'success',
  [ProposalStatus.Cancelled]: 'default',
  [ProposalExtraStatus.ReadyToSchedule]: 'default',
  [ProposalExtraStatus.ReadyToExecute]: 'default',
  [ProposalExtraStatus.Blocked]: 'danger',
} as const;

export const votePhaseVariant: Record<VoteStatus, BadgeVariant> = {
  [VoteStatus.ActiveMain]: 'default',
  [VoteStatus.ActiveObjection]: 'default',
  [VoteStatus.Passed]: 'success',
  [VoteStatus.Rejected]: 'warning',
  [VoteStatus.Executed]: 'success',
  [VoteStatus.Pending]: 'success',
};

export const votePhaseContent = {
  [VoteStatus.ActiveMain]: 'Main phase',
  [VoteStatus.ActiveObjection]: 'Objection phase',
  [VoteStatus.Passed]: 'Passed',
  [VoteStatus.Rejected]: 'Rejected',
  [VoteStatus.Executed]: 'Executed',
  [VoteStatus.Pending]: 'Passed',
};
