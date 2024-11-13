import { BadgeVariant, ProposalStatus } from './types';

export const statusBadgeContent = {
  [ProposalStatus.EXECUTED]: 'Executed',
  [ProposalStatus.PENDING]: 'Pending in  Dual Governance',
  [ProposalStatus.READY_TO_EXECUTE]: 'Ready to Execute',
};

export const statusBadgeVariant: Record<ProposalStatus, BadgeVariant> = {
  [ProposalStatus.EXECUTED]: 'success',
  [ProposalStatus.PENDING]: 'warning',
  [ProposalStatus.READY_TO_EXECUTE]: 'default',
};
