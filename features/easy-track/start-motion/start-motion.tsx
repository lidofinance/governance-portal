import { useAvailableMotions } from '../hooks/use-available-motions';
import {
  Container,
  Option,
  ToastError,
  ToastSuccess,
} from '@lidofinance/lido-ui';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useForm, FormProvider } from 'react-hook-form';
import { formParts, getDefaultFormPartsData, FormData } from './parts';
import { Fieldset } from './parts/style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { Button } from 'shared/components/button';
import { RetryHint } from './style';
import { useCallback, useState } from 'react';
import { getScriptFactoryByMotionType } from '../utils/get-motion-type';
import { useLidoSDK } from 'providers/lido-sdk';
import { validateMotionExtraData } from '../utils/on-submit-validation';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { getErrorMessage } from 'utils';

export const StartMotion = () => {
  const { availableMotions } = useAvailableMotions();
  const [isSubmitting, setSubmitting] = useState(false);

  const contractEasyTrack = useWriteContract(EasyTrack.abi);
  const easyTrackAddress = useContractAddress(EasyTrack);

  const { chainId } = useLidoSDK();

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      motionType: null,
      ...getDefaultFormPartsData(),
    },
  });

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const motionType = formData.motionType;
        if (!motionType || !(motionType in formParts)) return;

        setSubmitting(true);

        const evmScriptFactory = getScriptFactoryByMotionType(
          chainId,
          motionType,
        );

        if (!evmScriptFactory) {
          throw new Error(
            `EVM script factory for motion type ${motionType} in chain ${chainId} not found`,
          );
        }

        const validMotionType = motionType as keyof typeof formParts;
        const extraValidationError = await validateMotionExtraData(
          validMotionType,
          formData[validMotionType],
        );

        if (extraValidationError) {
          ToastError(extraValidationError, {});
          setSubmitting(false);
          return;
        }

        const txHash = await formParts[validMotionType].populateTx({
          evmScriptFactory,
          formData: formData[validMotionType],
          contract: {
            instance: contractEasyTrack,
            address: easyTrackAddress,
          },
        });

        ToastSuccess(
          `Motion submitted successfully! Transaction hash: ${txHash}`,
          {},
        );

        formMethods.reset({
          motionType: null,
          ...getDefaultFormPartsData(),
        });

        setSubmitting(false);
      } catch (error: any) {
        console.error(error);
        ToastError(getErrorMessage(error), {});
        setSubmitting(false);
      }
    },
    [chainId, contractEasyTrack, easyTrackAddress, formMethods],
  );

  const motionType = formMethods.watch('motionType');

  const CurrentFormPart =
    motionType && motionType in formParts
      ? formParts[motionType as keyof typeof formParts].Component
      : null;

  // Filter available motions to only show supported ones
  const supportedMotions =
    availableMotions?.filter((motion) => motion.motionType in formParts) || [];

  return (
    <FormProvider {...formMethods}>
      <Container as="main" size="tight">
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <Fieldset>
            <SelectHookForm fieldName="motionType" label="Motion type">
              {supportedMotions.map((motion) => (
                <Option key={motion.address} value={motion.motionType}>
                  {getMotionTypeDisplayName(motion.motionType)}
                </Option>
              ))}
            </SelectHookForm>
          </Fieldset>
          {CurrentFormPart && motionType && (
            <CurrentFormPart
              fieldNames={
                formParts[motionType as keyof typeof formParts].fieldNames
              }
              submitAction={
                <>
                  <Button
                    type="submit"
                    fullwidth
                    loading={isSubmitting}
                    disabled={
                      formMethods.formState.isDirty &&
                      !formMethods.formState.isValid
                    }
                  >
                    Submit Motion
                  </Button>
                  {isSubmitting && (
                    <RetryHint>
                      If something went wrong press{' '}
                      <button type="submit">Retry</button>
                    </RetryHint>
                  )}
                </>
              }
            />
          )}
        </form>
      </Container>
    </FormProvider>
  );
};
