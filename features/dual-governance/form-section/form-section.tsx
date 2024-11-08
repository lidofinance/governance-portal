import { Summary } from './summary';
import { FormSectionStyled } from './style';

export const FormSection = () => {
  return (
    <FormSectionStyled>
      <Summary />
      {/* {currentGovernanceState === VisibleGovernanceState.Blocked && (
        <BlockedStateForm />
      )}
      {(currentGovernanceState === VisibleGovernanceState.Normal ||
        currentGovernanceState === VisibleGovernanceState.Attention) && (
        <NormalStateForm />
      )} */}
    </FormSectionStyled>
  );
};
