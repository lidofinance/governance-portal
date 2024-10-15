import { useDualGovernanceState } from 'providers/dual-governance-state';
import { Summary } from './summary';
import { FormSectionStyled } from './styles';
import { DualGovernanceForm as BlockedStateForm } from './form/dual-governance-form';
import { DualGovernanceForm as NormalStateForm } from './form/normal-state/dual-governance-form';
import { GovernanceStateIndicator } from '../../types/dual-governance';

export const FormSection = () => {
  const { currentGovernanceState } = useDualGovernanceState();

  return (
    <FormSectionStyled>
      <Summary />
      {currentGovernanceState === GovernanceStateIndicator.Blocked && (
        <BlockedStateForm />
      )}
      {currentGovernanceState === GovernanceStateIndicator.Normal && (
        <NormalStateForm />
      )}
    </FormSectionStyled>
  );
};
