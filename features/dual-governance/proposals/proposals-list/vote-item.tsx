import { MouseEventHandler, useState } from 'react';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VoteStatus } from 'shared/votes/types';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  VoteStatusWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalStatus } from 'features/dual-governance/proposals/types';

type Props = {
  id: number;
  script: string;
  description?: string;
  isAragon?: boolean;
  slim?: boolean;
  voteState?: {
    isQuorumReached: boolean;
    status: VoteStatus;
  };
  proposalStatus?: ProposalStatus;
  onProposalClick: MouseEventHandler<HTMLDivElement>;
};

export const VoteItem = ({
  id,
  description,
  isAragon,
  voteState,
  proposalStatus,
  slim,
  onProposalClick,
}: Props) => {
  const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const descriptionLines = description ? description.split('\n') : [];

  return (
    <ProposalListItemWrapper onClick={onProposalClick}>
      <SummarySection>
        <ProposalName
          isAragon
          id={id}
          isUnknownContractCalled={isUnknownContractCalled}
        />
        <VoteStatusWrapper>
          <StatusBadge
            isAragon={isAragon}
            voteState={voteState}
            proposalStatus={proposalStatus}
          />
        </VoteStatusWrapper>
      </SummarySection>
      {descriptionLines.length > 0 && (
        <ProposalDescription $slim={slim}>
          {descriptionLines.map((line, index) => (
            <DescriptionText key={index}>{line}</DescriptionText>
          ))}
        </ProposalDescription>
      )}
    </ProposalListItemWrapper>
  );
};
