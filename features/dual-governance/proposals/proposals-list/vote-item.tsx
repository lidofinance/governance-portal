import { useState } from 'react';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VoteStatus } from 'shared/votes/types';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  LinkWrapper,
  VoteStatusWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ArrowRight } from 'shared/components/icons';
import { config } from 'config';
import { ProposalStatus } from 'features/dual-governance/proposals/types';

type Props = {
  id: number;
  script: string;
  description?: string;
  isAragon?: boolean;
  voteState?: {
    isQuorumReached: boolean;
    status: VoteStatus;
  };
  proposalStatus?: ProposalStatus;
};

export const VoteItem = ({
  id,
  description,
  isAragon,
  voteState,
  proposalStatus,
}: Props) => {
  const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const descriptionLines = description ? description.split('\n') : [];

  return (
    <ProposalListItemWrapper>
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
        <ProposalDescription $slim>
          {descriptionLines.map((line, index) => (
            <DescriptionText key={index}>{line}</DescriptionText>
          ))}
        </ProposalDescription>
      )}
    </ProposalListItemWrapper>
  );
};
