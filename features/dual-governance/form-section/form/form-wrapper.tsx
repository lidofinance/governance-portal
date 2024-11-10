import { useConsentContext } from 'providers/dg-consent';
import { DualGovernanceExplainer } from './explainer';
import { DualGovernanceFormWrapperStyled, WrapperTitle } from './style';
import { Text } from 'shared/components/text';

export const DualGovernanceFormWrapper = () => {
  const { isConsentGiven } = useConsentContext();

  return (
    <DualGovernanceFormWrapperStyled>
      <WrapperTitle>
        <Text size={34} weight={500}>
          Dual Governance
        </Text>
        <Text>i</Text>
      </WrapperTitle>

      {isConsentGiven ? null : <DualGovernanceExplainer />}
    </DualGovernanceFormWrapperStyled>
  );
};
