import { MouseEventHandler, useState } from 'react';
import { VoteStatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  VoteStatusWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { VoteData } from 'shared/votes/types';

type Props = {
  script: string;
  description?: string;
  state: VoteData['state'];
  onVoteClick: MouseEventHandler<HTMLDivElement>;
  startDate: bigint;
  yea: bigint;
  nay: bigint;
} & Pick<VoteData, 'id' | 'voteTime' | 'objectionPhaseTime'>;

export const VoteItem = ({
  id,
  description,
  state,
  onVoteClick,
  voteTime,
  objectionPhaseTime,
  startDate,
  yea,
  nay,
}: Props) => {
  const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const descriptionLines = description ? description.split('\n') : [];

  return (
    <ProposalListItemWrapper onClick={onVoteClick}>
      <SummarySection>
        <ProposalName
          isAragon
          id={id}
          isUnknownContractCalled={isUnknownContractCalled}
        />
        <VoteStatusWrapper>
          <VoteStatusBadge
            state={state}
            voteTime={voteTime}
            objectionPhaseTime={objectionPhaseTime}
            startDate={startDate}
            yea={yea}
            nay={nay}
          />
        </VoteStatusWrapper>
      </SummarySection>
      {descriptionLines.length > 0 && (
        <ProposalDescription>
          {descriptionLines.map((line, index) => (
            <DescriptionText key={index}>{line}</DescriptionText>
          ))}
        </ProposalDescription>
      )}
    </ProposalListItemWrapper>
  );
};
