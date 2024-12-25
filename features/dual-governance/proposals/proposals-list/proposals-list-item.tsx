import { StatusBadge } from 'features/dual-governance/proposals/shared-components/status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  TimelockWrapper,
  TimeLockDescription,
  StatusBadgeWrapper,
} from './style';
import { ProposalName } from 'features/dual-governance/proposals/shared-components/proposal-name/proposal-name';
import { ProposalCombinedData } from 'features/dual-governance/proposals/types';
import { ProposalTimelock } from 'features/dual-governance/proposals/shared-components/proposal-timelock';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useDualGovernanceContext } from 'providers/dual-governance';

type Props = {
  id: number;
  description: string;
  calls: any[];
  proposalDetails: ProposalCombinedData['proposalDetails'];
};

export const ProposalsListItem = ({
  id,
  description,
  proposalDetails,
  calls,
}: Props) => {
  const { visibleState } = useDualGovernanceContext();
  // const [isUnknownContractCalled, setIsUnknownContractCalled] = useState(false);

  // const { detailedState } = useDualGovernanceContext();
  //
  // console.log(detailedState, 'detailedState');
  //
  // const vetoSignallingReactivationTime =
  //   detailedState?.vetoSignallingReactivationTime;

  const { status, scheduledAt, submittedAt } = proposalDetails;

  const descriptionLines = description.split('\n');

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalName
          id={id}
          // isUnknownContractCalled={isUnknownContractCalled}
        />
        <StatusBadgeWrapper>
          <StatusBadge
            proposalStatus={status}
            submittedAt={submittedAt}
            scheduledAt={scheduledAt}
          />
        </StatusBadgeWrapper>
        <TimelockWrapper>
          <ProposalTimelock
            proposalStatus={status}
            submittedAt={submittedAt}
            scheduledAt={scheduledAt}
            hideOnCountdownFinish
          />
          {visibleState === VisibleGovernanceState.BlockedVetoSignalling && (
            <TimeLockDescription>
              <span>Executable if:</span>
              <br />
              <span>{'stETH veto support < 1%'}</span>
            </TimeLockDescription>
          )}
          {visibleState === VisibleGovernanceState.BlockedRageQuit && (
            <TimeLockDescription>
              <span>Executable if:</span>
              <br />
              <span>{'stETH veto support < 1%,'}</span>
              <br />
              <span>RageQuit finished</span>
            </TimeLockDescription>
          )}
          {visibleState === VisibleGovernanceState.BlockedDeactivation && (
            <TimeLockDescription>
              <span>Executable in</span>
            </TimeLockDescription>
          )}
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
