import { ReactComponent as ProposalsLogo } from 'assets/proposals-logo.svg';
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
} from '../styles';
import { useDecodedScript } from 'shared/hooks/useDecodedScript';

type Props = {
  script?: string;
  children?: React.ReactNode;
};

export const ProposalListItem = ({ script }: Props) => {
  const { binary, decoded } = useDecodedScript(script ?? '');

  return (
    <ProposalListItemWrapper>
      <SummarySection>
        <TitleWrapper>
          <LogoWrapper>
            <ProposalsLogo />
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
