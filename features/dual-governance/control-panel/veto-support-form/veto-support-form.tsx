import { FormController } from 'shared/hook-form/form-controller';
import { SupportFormProvider } from './support-form-context';
import { TokenSelect } from './token-select';
import { VetoSupportFormControls } from './veto-support-form-controls';
import { SupportFormAdditionalInfo } from './support-form-additional-info';
import { SubmitButtonSupport } from './submit-button-support';

export const VetoSupportForm = () => {
  return (
    <SupportFormProvider>
      <FormController>
        <TokenSelect />
        <VetoSupportFormControls />
        <SupportFormAdditionalInfo />
        <SubmitButtonSupport />
      </FormController>
    </SupportFormProvider>
  );
};
