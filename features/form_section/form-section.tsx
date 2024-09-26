import { Summary } from './summary';
import { FormSectionStyled } from './styles';
import { DualGovernanceForm } from './form/dual-governance-form';

export const FormSection = () => {
  return (
    <FormSectionStyled>
      <Summary />
      <DualGovernanceForm />
    </FormSectionStyled>
  );
};
