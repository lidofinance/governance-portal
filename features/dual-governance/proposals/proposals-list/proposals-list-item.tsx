import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  TimelockWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { ProposalTimelock } from 'features/dual-governance/proposals/shared-components/proposal-timelock';

type Props = {
  id: number;
  description: string;
  calls: any[];
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

export const ProposalsListItem = ({
  id,
  description,
  // calls = [],
  proposalDetails,
}: Props) => {
  // TODO: TBD
  // const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const { status, scheduledAt, submittedAt } = proposalDetails;

  const descriptionLines = description.split('\n');

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={id}
          // isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadge
          proposalStatus={status}
          submittedAt={submittedAt}
          scheduledAt={scheduledAt}
        />
        <TimelockWrapper>
          <ProposalTimelock
            proposalStatus={status}
            submittedAt={submittedAt}
            scheduledAt={scheduledAt}
            hideOnCountdownFinish
          />
        </TimelockWrapper>
      </SummarySection>
      <ProposalDescription>
        {descriptionLines.map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
      </ProposalDescription>
    </ProposalListItemWrapper>
  );
};
