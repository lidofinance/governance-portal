import { MouseEventHandler } from 'react';
import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VisibleGovernanceState } from 'features/dual-governance/types';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  ProposalListItemToEnact,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { ProposalTimelock } from 'features/dual-governance/proposals/shared-components/proposal-timelock';
import { useDualGovernanceContext } from 'providers/dual-governance';

type Props = {
  id: number;
  description: string;
  calls: any[];
  isReadyToEnact?: boolean;
  proposalDetails: ProposalCombinedData['proposalDetails'];
  onProposalClick: MouseEventHandler<HTMLDivElement>;
};

export const ProposalsListItem = ({
  isReadyToEnact = false,
  id,
  description,
  // calls = [],
  proposalDetails,
  onProposalClick,
}: Props) => {
  // TODO: TBD
  // const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const { visibleState } = useDualGovernanceContext();

  const { status, scheduledAt, submittedAt } = proposalDetails;

  if (
    isReadyToEnact &&
    visibleState === VisibleGovernanceState.BlockedDeactivation
  ) {
    return (
      <ProposalListItemToEnact onClick={onProposalClick}>
        <SummarySection>
          <ProposalName warning id={id} />
          <StatusBadge proposalStatus={status} />
        </SummarySection>
        <ProposalDescription>
          <DescriptionText>
            Kill all active governance proposals
          </DescriptionText>
        </ProposalDescription>
      </ProposalListItemToEnact>
    );
  }

  const descriptionLines = description.split('\n');

  return (
    <ProposalListItemWrapper onClick={onProposalClick}>
      <SummarySection>
        <ProposalName
          id={id}
          // isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadge proposalStatus={status} />
        <ProposalTimelock
          proposalStatus={status}
          submittedAt={submittedAt}
          scheduledAt={scheduledAt}
        />
      </SummarySection>
      <ProposalDescription>
        {descriptionLines.map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
