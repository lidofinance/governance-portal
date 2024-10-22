import { useDualGovernanceState } from 'providers/dual-governance-state';
import { Summary } from './summary';
import { FormSectionStyled } from './style';
import { Todo as BlockedStateForm } from './form/todo';
import { DualGovernanceForm as NormalStateForm } from './form/dual-governance-form';
import { GovernanceStateIndicator } from '../types';

export const FormSection = () => {
  const { currentGovernanceState } = useDualGovernanceState();

  return (
    <FormSectionStyled>
      <Summary />
      {currentGovernanceState === GovernanceStateIndicator.Blocked && (
        <BlockedStateForm />
      )}
      {(currentGovernanceState === GovernanceStateIndicator.Normal ||
        currentGovernanceState === GovernanceStateIndicator.Attention) && (
        <NormalStateForm />
      )}
    </FormSectionStyled>
  );
};
