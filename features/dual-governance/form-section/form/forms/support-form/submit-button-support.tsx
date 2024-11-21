import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { useSupportFormDataContext } from './support-form-context';

export const SubmitButtonSupport = () => {
  const { approveData } = useSupportFormDataContext();

  return (
    <SubmitButtonHookForm
      isLocked={approveData.needsApprove}
      errorField="amount"
      data-testid="supportBtn"
    >
      Support Veto
    </SubmitButtonHookForm>
  );
};
