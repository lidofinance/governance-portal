import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';
import { VisibleGovernanceState } from 'features/dual-governance/types';

import { Script } from 'features/dual-governance/evm-script-parsed/compact';
import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  ScriptSection,
  ProposalListItemToEnact,
  LinkWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ArrowRight } from 'shared/components/icons';
import Link from 'next/link';
import { PROPOSALS_PATH } from 'constants/urls';
import {
  ProposalCombinedData,
  ProposalStatus,
} from 'features/dual-governance/proposals/types';
import { useDualGovernanceState } from 'features/dual-governance/hooks/use-dual-governance-state';
import { ProposalTimelock } from 'features/dual-governance/proposals/shared-components/proposal-timelock';

type Props = {
  id: number;
  description: string;
  calls: any[];
  isReadyToEnact?: boolean;
  proposalInfo: ProposalCombinedData['proposalInfo'];
};

export const ProposalItem = ({
  isReadyToEnact = false,
  id,
  description,
  calls = [],
  proposalInfo,
}: Props) => {
  // TODO: TBD
  // const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  const { data } = useDualGovernanceState();

  console.log(proposalInfo, 'proposalInfo');

  const { status, scheduledAt, submittedAt } = proposalInfo[0];
  if (
    isReadyToEnact &&
    data?.visibleState === VisibleGovernanceState.BlockedDeactivation
  ) {
    return (
      <ProposalListItemToEnact>
        <SummarySection>
          <ProposalName warning id={id} />
          <StatusBadge proposalStatus={status} />
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
          id={id}
          // isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadge proposalStatus={status} />
        <ProposalTimelock
          status={status}
          scheduledAt={scheduledAt}
          submittedAt={submittedAt}
        />
      </SummarySection>
      <ProposalDescription $slim>
        {descriptionLines.map((line, index) => (
          <DescriptionText key={index}>{line}</DescriptionText>
        ))}
      </ProposalDescription>

      {calls.length > 0 && (
        <ScriptSection>
          <Script calls={calls} />
        </ScriptSection>
      )}
      <LinkWrapper>
        <Link href={`${PROPOSALS_PATH}/${id}`}>
          <ArrowRight />
        </Link>
      </LinkWrapper>
    </ProposalListItemWrapper>
  );
};
