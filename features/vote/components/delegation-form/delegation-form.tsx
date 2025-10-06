import { DelegationStatus } from './delegation-status';
import { DelegationFormSubtitle } from './delegation-form-subtitle';
import { DelegationAddressInput } from './delegation-address-input';
import { DelegationFormBalance } from './delegation-form-balance';
import { DelegationFormSubmitButton } from './delegation-form-submit-button';
import { DelegationFormFootNote } from './delegation-form-foot-note';
import { DelegationFormController } from './delegation-form-controller';
import { DelegationTxStatus } from './delegation-tx-status';
import { DelegationFormPublicDelegateTooltip } from './delegation-form-public-delegate-tooltip';
import {
  DelegationFormProvider,
  DelegationFormProviderProps,
} from 'features/vote/providers/delegation-form-context';

type Props = DelegationFormProviderProps & {
  onCustomizeClick?: () => void;
};

export const DelegationForm = ({
  onCustomizeClick,
  ...providerProps
}: Props) => {
  return (
    <DelegationFormProvider {...providerProps}>
      <DelegationFormController>
        <DelegationFormSubtitle />
        <DelegationStatus />
        <DelegationAddressInput />
        <DelegationFormPublicDelegateTooltip />
        <DelegationFormBalance onCustomizeClick={onCustomizeClick} />
        <DelegationFormSubmitButton />
        <DelegationFormFootNote />
        <DelegationTxStatus />
      </DelegationFormController>
    </DelegationFormProvider>
  );
};
