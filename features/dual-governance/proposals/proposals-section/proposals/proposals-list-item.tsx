import { ProposalScriptParsed } from 'features/dual-governance/proposals/proposals-section/proposal-script';
import {
  ProposalStatusBadge,
  ProposalStatus,
} from 'features/dual-governance/proposals/shared-components/proposal-status-badge';

import {
  ProposalListItemWrapper,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  ScriptSection,
  ProposalListItemToEnact,
} from 'features/dual-governance/proposals/proposals-section/style';
import { useDecodedScript } from 'shared/hooks/useDecodedScript';
import { useDualGovernanceState } from 'providers/dual-governance-state';
import { GovernanceStateIndicator } from 'features/dual-governance/types';
import { ProposalPartName } from 'features/dual-governance/proposals/shared-components/proposal-part-name/proposal-part-name';

type Props = {
  script?: string;
  isReadyToEnact?: boolean;
  children?: React.ReactNode;
};

export const ProposalListItem = ({ script, isReadyToEnact = false }: Props) => {
  const { binary, decoded } = useDecodedScript(script ?? '');

  const { currentGovernanceState } = useDualGovernanceState();

  if (
    isReadyToEnact &&
    currentGovernanceState === GovernanceStateIndicator.Blocked
  ) {
    return (
      <ProposalListItemToEnact>
        <SummarySection>
          <ProposalPartName warning partName="Vote #176 part 1" />
          <ProposalStatusBadge status={ProposalStatus.READY_TO_EXECUTE} />
        </SummarySection>
        <ProposalDescription $slim>
          <DescriptionText>
            Kill all active governance proposals
          </DescriptionText>
        </ProposalDescription>
      </ProposalListItemToEnact>
    );
  }

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <ProposalPartName partName="Vote #176 part 1" />
        <ProposalStatusBadge status={ProposalStatus.PENDING} />
      </SummarySection>
      <ProposalDescription $slim>
        <DescriptionText>
          Replace Rated Labs with MatrixedLink in Lido on Ethereum Oracle set
        </DescriptionText>
      </ProposalDescription>
      <ScriptSection>
        <ProposalScriptParsed binary={binary} decoded={decoded} />
      </ScriptSection>
    </ProposalListItemWrapper>
  );
};
