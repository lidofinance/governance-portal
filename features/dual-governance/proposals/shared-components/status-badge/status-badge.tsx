import { Badge } from 'features/dual-governance/proposals/shared-components/status-badge/style';
import {
  statusBadgeContent,
  statusBadgeVariant,
} from 'features/dual-governance/proposals/shared-components/status-badge/helpers';
import { ProposalStatus } from 'features/dual-governance/proposals/types';

type Props = {
  proposalStatus: ProposalStatus;
};

export const StatusBadge = ({ proposalStatus }: Props) => {
  if (!proposalStatus) {
    return null;
  }

  return (
    <Badge $variant={statusBadgeVariant[proposalStatus] || 'default'}>
      {statusBadgeContent[proposalStatus]}
    </Badge>
  );
};
