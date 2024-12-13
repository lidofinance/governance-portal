import { useAccount } from 'wagmi';
import { useSupportFormDataContext } from './support-form-context';
import { TokenAmountInputHookForm } from 'shared/hook-form/token-amount-input-hook-form';
import { useDappStatus } from 'shared/hooks';
import { Token } from 'shared/blockchain/types';
import { NftMultiselectHookForm } from 'features/dual-governance/nft-multiselect';

export const VetoSupportFormControls = () => {
  const { isConnected } = useAccount();
  const { isDappActive } = useDappStatus();
  const { selectedToken, maxAmount, networkData } = useSupportFormDataContext();

  if (selectedToken === Token.unstETH) {
    return (
      <NftMultiselectHookForm
        fieldName="selectedNftIds"
        options={networkData.withdrawalRequests}
      />
    );
  }

  return (
    <TokenAmountInputHookForm
      disabled={isConnected && !isDappActive}
      fieldName="amount"
      token={selectedToken}
      data-testid="vetoSupportInput"
      maxValue={maxAmount}
    />
  );
};
