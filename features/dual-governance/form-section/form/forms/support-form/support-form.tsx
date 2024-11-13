import { useCallback } from 'react';

import { SummaryRow, ActionsWrapper } from './style';

import { useDepositingModal } from 'features/dual-governance/modals/modal-manager';

import { TransactionState } from 'features/dual-governance/types';
import { Button } from 'shared/components/button';
import { FormController } from 'shared/hook-form/form-controller';
import { SupportFormProvider } from './support-form-context';
import { TokenSelect } from './token-select';
import { SupportAmountInput } from './support-amount-input';
import { Text } from 'shared/components/text';

export const SupportForm = () => {
  // TODO: Remove - for testing purposes only
  const { openModal: openDepositingModal } = useDepositingModal();

  const handleInputChange = useCallback((e: any) => {
    console.log(e);
  }, []);

  return (
    <SupportFormProvider>
      <FormController>
        <TokenSelect />
        <SupportAmountInput />
        <SummaryRow>
          <Text size={14} color="secondary">
            Percent of total stETH supply
          </Text>
          <Text size={14} color="secondary">
            0.31%
          </Text>
        </SummaryRow>
        <SummaryRow>
          <Text size={14} color="secondary">
            Max transaction cost
          </Text>
          <Text size={14} color="secondary">
            0.000212 ETH ($10.62)
          </Text>
        </SummaryRow>
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
        <ActionsWrapper>
          <Button
            size="lg"
            onClick={() =>
              openDepositingModal({
                amount: '1123.1231',
                state: TransactionState.ERROR,
              })
            }
          >
            Support Veto
          </Button>
        </ActionsWrapper>
      </FormController>
    </SupportFormProvider>
  );
};
