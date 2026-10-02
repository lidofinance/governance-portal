import { DelegationStatus } from './delegation-status';
import { DelegationAddressInput } from './delegation-address-input';
import { DelegationFormBalance } from './delegation-form-balance';
import { DelegationFormSubmitButton } from './delegation-form-submit-button';
import { DelegationFormController } from './delegation-form-controller';
import { DelegationFormPublicDelegateTooltip } from './delegation-form-public-delegate-tooltip';
import { DelegationFormProvider } from '@vote/providers/delegation-form-context';

export const DelegationForm = () => {
  return (
    <DelegationFormProvider>
      <DelegationFormController>
        <DelegationStatus />
        <DelegationAddressInput />
        <DelegationFormPublicDelegateTooltip />
        <DelegationFormBalance />
        <DelegationFormSubmitButton />
      </DelegationFormController>
    </DelegationFormProvider>
  );
};
