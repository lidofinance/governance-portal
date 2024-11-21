import { FormController } from 'shared/hook-form/form-controller';
import { SupportFormProvider } from './support-form-context';
import { TokenSelect } from './token-select';
import { SupportAmountInput } from './support-amount-input';
import { SupportFormAdditionalInfo } from './support-form-additional-info';
import { SubmitButtonSupport } from './submit-button-support';

export const SupportForm = () => {
  return (
    <SupportFormProvider>
      <FormController>
        <TokenSelect />
        <SupportAmountInput />
        <SupportFormAdditionalInfo />
        {/* {activeTab === 1 && (
          <>
            <StyledInput
              onChange={handleInputChange}
              // maxValue={BigNumber.from(10000)}
              fullwidth
              disabled={false}
              placeholder="Enter your amount of wstETH"
            />
          </>
        )}
        {activeTab === 2 && (
          <>
            <NftMultiselect></NftMultiselect>
          </>
        )} */}
        <SubmitButtonSupport />
      </FormController>
    </SupportFormProvider>
  );
};
