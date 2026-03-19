import { useAvailableMotions } from '../hooks/use-available-motions';
import { Container, Option, ToastError } from '@lidofinance/lido-ui';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useForm, FormProvider } from 'react-hook-form';
import { formParts, getDefaultFormPartsData, FormData } from './parts';
import { type AnyFormPart } from './parts/create-motion-form-part';
import { Fieldset, MessageBox } from './parts/style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { Button } from 'shared/components/button';
import { MotionTypeSelectSkeleton, RetryHint } from './style';
import { useCallback, useEffect, useState } from 'react';
import { getScriptFactoryByMotionType } from '../utils/get-motion-type';
import { useLidoSDK } from 'providers/lido-sdk';
import { validateMotionExtraData } from '../utils/on-submit-validation';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EasyTrack } from 'shared/blockchain/contracts';
import { Hex } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { useTxModalMotion } from '@easy-track/write-actions/create-motion/modal-stages';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';

type Props = {
  onComplete: (txHash: Hex) => void;
};

const StartMotionSkeleton = () => (
  <Container as="main" size="tight">
    <Fieldset>
      <MotionTypeSelectSkeleton showOnBackground />
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
  const { txModalStages } = useTxModalMotion();
  const waitForTx = useTxConfirmation();
  const { data: isMultisig } = useIsContract();
  const queryClient = useQueryClient();

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
      const motionType = formData.motionType;
      if (!motionType || !(motionType in formParts)) return;

      setSubmitting(true);

      try {
        const evmScriptFactory = getScriptFactoryByMotionType(
          chainId,
          motionType,
        );

        if (!evmScriptFactory) {
          ToastError(
            `EVM script factory for motion type ${motionType} in chain ${chainId} not found`,
            {},
          );
          return;
        }

        const validMotionType = motionType as keyof typeof formParts;

        if (!rpcProvider) {
          ToastError('No provider available', {});
          return;
        }

        const extraValidationError = await validateMotionExtraData(
          validMotionType,
          formData[validMotionType],
          { chainId, provider: rpcProvider },
        );

        if (extraValidationError) {
          ToastError(extraValidationError, {});
          return;
        }

        txModalStages.signSubmit();

        const part = formParts[validMotionType] as unknown as AnyFormPart;
        const txHash = await part.populateTx({
          evmScriptFactory,
          formData: formData[validMotionType] as Record<string, unknown>,
          contract: {
            write: contractEasyTrack,
            address: easyTrackAddress,
          },
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return;
        }

        txModalStages.pendingSubmit(txHash);

        const receipt = await waitForTx(txHash);

        if (receipt.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        await queryClient.invalidateQueries({
          queryKey: ['active-motions', chainId],
        });

        txModalStages.successSubmit(txHash);
        onComplete(txHash);

        formMethods.reset({
          motionType: null,
          ...getDefaultFormPartsData(),
        });
      } catch (error) {
        txModalStages.failed(error);
      } finally {
        setSubmitting(false);
      }
    },
    [
      chainId,
      contractEasyTrack,
      easyTrackAddress,
      formMethods,
      isMultisig,
      onComplete,
      queryClient,
      rpcProvider,
      txModalStages,
      waitForTx,
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
      ? (
          formParts[
            motionType as keyof typeof formParts
          ] as unknown as AnyFormPart
        ).Component
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
                    buttonStyleVersion="default"
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
