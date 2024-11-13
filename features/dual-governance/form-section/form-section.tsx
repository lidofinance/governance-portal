import { Summary } from './summary';
import { FormSectionStyled } from './style';
import { DualGovernanceFormWrapper } from './form/form-wrapper';
import { ConsentProvider } from 'providers/dg-consent';

export const FormSection = () => {
  return (
    <FormSectionStyled>
      <Summary />
      <ConsentProvider>
        <DualGovernanceFormWrapper />
      </ConsentProvider>
    </FormSectionStyled>
  );
};
