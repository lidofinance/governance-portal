import { useState } from 'react';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VoteStatus } from 'shared/votes/types';
import { ProposalStatus } from 'features/dual-governance/types';

import { Script } from 'features/dual-governance/proposals/shared-components/evm-script-parsed/compact';
import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  ScriptSection,
  ProposalListItemToEnact,
  LinkWrapper,
} from '../style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { AragonScript } from 'features/dual-governance/proposals/shared-components/evm-script-parsed/compact/aragon-script';
import { ArrowRight } from 'shared/components/icons';

type Props = {
  script?: string;
  calls?: any[];
  isReadyToEnact?: boolean;
  children?: React.ReactNode;
  voteId: number;
  description: string;
  isAragon?: boolean;
  voteState?: {
    isQuorumReached: boolean;
    status: VoteStatus;
  };
  proposalStatus?: ProposalStatus;
  onItemClick: (id: number) => Promise<boolean>;
};

export const ProposalListItem = ({
  isReadyToEnact = false,
  voteId,
  description,
  calls = [],
  script,
  isAragon,
  voteState,
  proposalStatus,
  onItemClick,
}: Props) => {
  const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);
  if (
    isReadyToEnact
    //  && currentGovernanceState === VisibleGovernanceState.BlockedDeactivation
  ) {
    return (
      <ProposalListItemToEnact>
        <SummarySection>
          <ProposalName warning voteId={voteId} />
          <StatusBadge isAragon={isAragon} voteState={voteState} />
        </SummarySection>
        <ProposalDescription $slim>
          <DescriptionText>
            Kill all active governance proposals
          </DescriptionText>
        </ProposalDescription>
      </ProposalListItemToEnact>
    );
  }

  const descriptionLines = description.split('\n');

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          isAragon={isAragon}
          voteId={voteId}
          isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadge
          isAragon={isAragon}
          voteState={voteState}
          proposalStatus={proposalStatus}
        />
      </SummarySection>
      <ProposalDescription $slim>
        {descriptionLines.map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
      </ProposalDescription>

      {!isAragon && calls?.length && (
        <ScriptSection>
          <Script calls={calls} />
        </ScriptSection>
      )}
      {isAragon && script && (
        <ScriptSection>
          <AragonScript
            onUnknownContractCalled={setIsUnknownContractCalled}
            script={script}
          />
        </ScriptSection>
      )}
      <LinkWrapper onClick={() => onItemClick(voteId)}>
        <ArrowRight />
      </LinkWrapper>
    </ProposalListItemWrapper>
  );
};
