import { BadgeVariant } from 'features/dual-governance/proposals/shared-components/status-badge/types';
import { VoteStatus } from 'shared/votes/types';
import { ProposalStatus } from 'features/dual-governance/proposals/types';

export const statusBadgeContent: Partial<Record<ProposalStatus, string>> = {
  [ProposalStatus.Submitted]: 'Pending in Dual Governance',
  [ProposalStatus.Scheduled]: 'Pending in Dual Governance',
  [ProposalStatus.Executed]: 'Executed',
};

export const statusBadgeVariant: Partial<Record<ProposalStatus, BadgeVariant>> =
  {
    [ProposalStatus.Submitted]: 'warning',
    [ProposalStatus.Scheduled]: 'warning',
    [ProposalStatus.Executed]: 'success',
  };

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
