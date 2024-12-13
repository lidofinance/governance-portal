import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { useSupportFormDataContext } from './support-form-context';
import { useMemo } from 'react';

export const SubmitButtonSupport = () => {
  const {
    approveData: { needsApprove },
    networkData: { isAssetManagementLocked },
  } = useSupportFormDataContext();

  const buttonLabel = useMemo(() => {
    if (isAssetManagementLocked) {
      return 'Action unavailable';
    }
    if (needsApprove) {
      return 'Unlock Tokens and Support Veto';
    }
    return 'Support Veto';
  }, [isAssetManagementLocked, needsApprove]);

  return (
    <SubmitButtonHookForm
      isLocked={needsApprove}
      disabled={isAssetManagementLocked}
      errorField="amount"
      data-testid="supportBtn"
    >
      {buttonLabel}
    </SubmitButtonHookForm>
  );
};
