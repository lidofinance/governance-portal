import { ProposalsIcon, WarningIcon } from 'shared/components/icons';
import { ProposalScriptParsed } from '../proposal-script';

import {
  LogoWrapper,
  ProposalListItemWrapper,
  ProposalStatus,
  TitleWrapper,
  Title,
  SummarySection,
  ProposalDescription,
  DescriptionText,
  ScriptSection,
  ProposalListItemToEnact,
  WarningIconWrapper,
} from '../style';
import { useDecodedScript } from 'shared/hooks';

type Props = {
  script?: string;
  isReadyToEnact?: boolean;
  children?: React.ReactNode;
};

export const ProposalListItem = ({ script, isReadyToEnact = false }: Props) => {
  const { binary, decoded } = useDecodedScript(script ?? '');

  if (
    isReadyToEnact
    //  && currentGovernanceState === VisibleGovernanceState.BlockedDeactivation
  ) {
    return (
      <ProposalListItemToEnact>
        <SummarySection>
          <TitleWrapper>
            <WarningIconWrapper>
              <WarningIcon />
            </WarningIconWrapper>
            <Title $warning>Kill</Title>
          </TitleWrapper>
          <ProposalStatus>Ready to enact</ProposalStatus>
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
        <TitleWrapper>
          <LogoWrapper>
            <ProposalsIcon />
          </LogoWrapper>
          <Title>Vote #176 part 1</Title>
        </TitleWrapper>
        <ProposalStatus>Pending in Dual Governance</ProposalStatus>
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
