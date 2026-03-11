import { ToastError } from '@lidofinance/lido-ui';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Fieldset } from './style';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { stonksOrderAbi } from 'abi/generated';
import { isAddress } from 'viem';
import { stonksOrderPage } from 'constants/urls';
import { usePublicClient } from 'wagmi';
import { getOrderByPlaceTxReceipt } from '@stonks/utils/get-order-by-tx';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';

type FormData = {
  txHashOrAddress: string;
};

export const StonksFindOrderForm = () => {
  const client = usePublicClient();
  const router = useRouter();

  const formMethods = useForm<FormData>({
    defaultValues: {
      txHashOrAddress: undefined,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const getOrderContract = useReadContractGetter(stonksOrderAbi);

  const handleSubmit = async (values: FormData) => {
    try {
      if (isAddress(values.txHashOrAddress)) {
        const orderContractReader = getOrderContract(values.txHashOrAddress);

        const stonksAddress = await orderContractReader('stonks');
        if (stonksAddress) {
          await router.push(stonksOrderPage(values.txHashOrAddress));
        } else {
          throw new Error('Invalid order address');
        }
      } else {
        try {
          if (!client) {
            return;
          }
          const txReceipt = await client.getTransactionReceipt({
            hash: values.txHashOrAddress as `0x${string}`,
          });
          const orderFromReceipt = getOrderByPlaceTxReceipt(txReceipt);
          await router.push(stonksOrderPage(orderFromReceipt.address));
        } catch (error) {
          throw new Error('Invalid tx hash');
        }
      }
    } catch (error: any) {
      console.error(error);
      ToastError(error?.message, {});
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
        <Fieldset>
          <InputHookForm
            fieldName="txHashOrAddress"
            label="Order creation tx hash or order address"
            autoComplete="off"
            id="search-address"
            rules={{
              required: 'Field is required',
              validate: (value) => {
                const addressErr = validateAddress(value);
                const isValidTxHash = /^0x[a-fA-F0-9]{64}$/.test(value);
                if (addressErr && !isValidTxHash) {
                  return 'Invalid tx hash or address';
                }
              },
            }}
          />
          <SubmitButtonHookForm
            errorField="txHashOrAddress"
            data-testid="findOrderBtn"
            buttonStyleVersion="default"
          >
            Find order
          </SubmitButtonHookForm>
        </Fieldset>
      </form>
    </FormProvider>
  );
};
