import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { useSupportFormDataContext } from './support-form-context';

export const SubmitButtonSupport = () => {
  const {
    approveData: { needsApprove },
  } = useSupportFormDataContext();

  return (
    <SubmitButtonHookForm
      isLocked={needsApprove}
      errorField="amount"
      data-testid="supportBtn"
      title="Zhopa"
    >
      {needsApprove ? 'Unlock Tokens and ' : ''}Support Veto
    </SubmitButtonHookForm>
  );
};
