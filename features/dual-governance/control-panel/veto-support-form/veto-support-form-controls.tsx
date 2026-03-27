import { useAccount } from 'wagmi';
import { useSupportFormDataContext } from './support-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { useDappStatus } from 'shared/hooks';
import { Token } from 'shared/blockchain/types';
import { NftMultiselectHookForm } from '@dg/nft-multiselect';
import { useMemo } from 'react';

export const VetoSupportFormControls = () => {
  const { isConnected } = useAccount();
  const { isDappActive } = useDappStatus();
  const { selectedToken, maxAmount, networkData } = useSupportFormDataContext();

  const inputDisabled = useMemo(() => {
    if (selectedToken === Token.stETH && networkData.stEthBalance === 0n) {
      return true;
    }

    if (selectedToken === Token.wstETH && networkData.wstEthBalance === 0n) {
      return true;
    }

    return isConnected && !isDappActive;
  }, [
    isConnected,
    isDappActive,
    networkData.stEthBalance,
    networkData.wstEthBalance,
    selectedToken,
  ]);

  if (selectedToken === Token.unstETH) {
    return (
      <NftMultiselectHookForm
        fieldName="selectedNftIds"
        options={networkData.withdrawalRequests}
        disabled={networkData.unstEthBalance === 0n}
        selectable
      />
    );
  }

  return (
    <TokenAmountInputHookForm
      disabled={inputDisabled}
      fieldName="amount"
      token={selectedToken}
      data-testid="vetoSupportInput"
      maxValue={maxAmount}
    />
  );
};
