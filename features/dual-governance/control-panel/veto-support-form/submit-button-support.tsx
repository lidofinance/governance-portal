import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { useSupportFormDataContext } from './support-form-context';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';

export const SubmitButtonSupport = () => {
  const {
    approveData: { needsApprove },
    networkData,
    selectedToken,
  } = useSupportFormDataContext();

  const isZeroBalance = useMemo(() => {
    switch (selectedToken) {
      case Token.stETH:
        return networkData.stEthBalance === 0n;
      case Token.wstETH:
        return networkData.wstEthBalance === 0n;
      case Token.unstETH:
        return networkData.unstEthBalance === 0n;
      default:
        return false;
    }
  }, [selectedToken, networkData]);

  const buttonLabel = useMemo(() => {
    if (networkData.isAssetManagementLocked) {
      return 'Action unavailable';
    }
    if (needsApprove) {
      return 'Unlock Tokens and Support Veto';
    }
    return 'Support Veto';
  }, [networkData.isAssetManagementLocked, needsApprove]);

  return (
    <SubmitButtonHookForm
      isLocked={needsApprove}
      disabled={isZeroBalance || networkData.isAssetManagementLocked}
      errorField="amount"
      data-testid="supportBtn"
    >
      {buttonLabel}
    </SubmitButtonHookForm>
  );
};
