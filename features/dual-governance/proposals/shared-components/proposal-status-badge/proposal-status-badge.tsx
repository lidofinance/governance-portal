import { ProposalStatus } from './types';
import { ProposalStatusBadgeWrapper } from './style';

import { statusBadgeVariant, statusBadgeContent } from './helpers';

type Props = {
  status: ProposalStatus;
};

export const ProposalStatusBadge = ({ status }: Props) => {
  return (
    <ProposalStatusBadgeWrapper $variant={statusBadgeVariant[status]}>
      {statusBadgeContent[status]}
    </ProposalStatusBadgeWrapper>
  );
};
