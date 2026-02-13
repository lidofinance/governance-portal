import { useAvailableMotions } from '../hooks/use-available-motions';
import { Container, Option, ToastError } from '@lidofinance/lido-ui';
import { SkeletonBar } from '../../vote/components/skeleton-bar';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useForm, FormProvider } from 'react-hook-form';
import { formParts, getDefaultFormPartsData, FormData } from './parts';
import { Fieldset, MessageBox } from './parts/style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { Button } from 'shared/components/button';
import { RetryHint } from './style';
import { useCallback, useEffect, useState } from 'react';
import { getScriptFactoryByMotionType } from '../utils/get-motion-type';
import { useLidoSDK } from 'providers/lido-sdk';
import { validateMotionExtraData } from '../utils/on-submit-validation';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { getErrorMessage } from 'utils';
import { Hex } from 'viem';

type Props = {
  onComplete: (txHash: Hex) => void;
};

const StartMotionSkeleton = () => (
  <Container as="main" size="tight">
    <Fieldset>
      <SkeletonBar style={{ height: 56, borderRadius: 10 }} showOnBackground />
    </Fieldset>
  </Container>
);

export const StartMotion = ({ onComplete }: Props) => {
  const { availableMotions, isLoading: isMotionsLoading } =
    useAvailableMotions();
  const [isSubmitting, setSubmitting] = useState(false);
  const contractEasyTrack = useWriteContract(EasyTrack.abi);
  const easyTrackAddress = useContractAddress(EasyTrack);

  const { chainId, rpcProvider } = useLidoSDK();

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
        if (!rpcProvider) {
          throw new Error('No provider available');
        }

        const extraValidationError = await validateMotionExtraData(
          validMotionType,
          formData[validMotionType],
          { chainId, provider: rpcProvider },
        );

        if (extraValidationError) {
          ToastError(extraValidationError, {});
          setSubmitting(false);
          return;
        }

        const txHash = await (formParts[validMotionType] as any).populateTx({
          evmScriptFactory,
          formData: formData[validMotionType],
          contract: {
            write: contractEasyTrack,
            address: easyTrackAddress,
          },
        });

        onComplete(txHash as Hex);

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
    [
      chainId,
      contractEasyTrack,
      easyTrackAddress,
      formMethods,
      onComplete,
      rpcProvider,
    ],
  );

  const motionType = formMethods.watch('motionType');
  const { isValid } = formMethods.formState;

  useEffect(() => {
    if (motionType) {
      void formMethods.trigger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionType]);

  const CurrentFormPart =
    motionType && motionType in formParts
      ? (formParts[motionType as keyof typeof formParts].Component as any)
      : null;

  // Filter available motions to only show supported ones
  const supportedMotions =
    availableMotions?.filter((motion) => motion.motionType in formParts) || [];

  if (isMotionsLoading) {
    return <StartMotionSkeleton />;
  }

  if (supportedMotions.length === 0 || availableMotions.length === 0) {
    return (
      <MessageBox>
        Only Trusted Callers & Node Operator have access to Easy Track motion
        creation
      </MessageBox>
    );
  }

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
                    disabled={!isValid}
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
