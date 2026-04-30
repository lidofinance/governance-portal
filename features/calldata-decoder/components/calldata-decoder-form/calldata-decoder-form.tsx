import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Hex, isHex } from 'viem';
import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { TextareaHookForm } from 'shared/hook-form/textarea-hook-form';
import { CalldataDecoderResult } from './calldata-decoder-result';
import { FormStyled } from './style';
import { SelectorMatch, useSelectorLookup } from './use-selector-lookup';
import { ToastError } from '@lidofinance/lido-ui';
import { decodeCalls, DecodedCall } from 'utils/decode-evm-script-calls';
import {
  EVM_SCRIPT_SPEC_ID,
  decodeEvmScript,
} from 'shared/blockchain/utils/decode-evm-script';
import { useLidoSDK } from 'providers/lido-sdk';
import { PageLoader } from 'shared/components/page-loader';

type FormValues = {
  calldata: string;
};

export const CalldataDecoderForm = () => {
  const { chainId, rpcProvider } = useLidoSDK();
  const [result, setResult] = useState<{
    isEvmScript: boolean;
    matches: SelectorMatch[];
    decodedCalls: DecodedCall[];
    calldata: Hex;
  }>();

  const lookupSelector = useSelectorLookup();

  const formMethods = useForm<FormValues>({
    defaultValues: { calldata: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const decoderContext = useMemo(
    () => ({
      chainId: chainId,
      fetchPolicy: 'local-only' as const,
      client: rpcProvider,
    }),
    [chainId, rpcProvider],
  );

  const onSubmit = async ({ calldata }: FormValues) => {
    try {
      const castedCalldata = calldata.trim() as Hex;
      setResult(undefined);

      const isEvmScript = castedCalldata.startsWith(`0x${EVM_SCRIPT_SPEC_ID}`);
      if (isEvmScript) {
        const calls = decodeEvmScript(castedCalldata);
        const decodedCalls = await decodeCalls(calls, decoderContext);

        setResult({
          isEvmScript: true,
          matches: [],
          decodedCalls,
          calldata: castedCalldata,
        });
      } else {
        const matches = lookupSelector(castedCalldata);

        if (matches.length === 0) {
          setResult({
            isEvmScript,
            matches,
            decodedCalls: [],
            calldata: castedCalldata,
          });
        } else {
          const decodedCalls = await decodeCalls(
            [
              {
                target: matches[0].address,
                payload: castedCalldata,
              },
            ],
            decoderContext,
          );

          setResult({
            isEvmScript,
            matches,
            decodedCalls,
            calldata: castedCalldata,
          });
        }
      }
    } catch (error) {
      console.error('[calldata-decoder] decode failed', error);
      const message =
        error instanceof Error ? error.message : 'Unable to decode calldata';
      ToastError(message, {});
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormStyled onSubmit={formMethods.handleSubmit(onSubmit)}>
        <TextareaHookForm
          fieldName="calldata"
          label="Encoded calldata"
          placeholder="0x..."
          style={{ height: 200 }}
          rules={{
            required: 'Calldata is required',
            validate: (value: string) => {
              const trimmed = value?.trim();
              if (!isHex(trimmed)) {
                return 'Calldata must be 0x-prefixed hex';
              }
              if (trimmed.length < 10) {
                return 'Calldata must include a 4-byte function selector';
              }
              if (trimmed.length % 2 !== 0) {
                return 'Calldata must have an even number of hex characters';
              }

              return true;
            },
          }}
        />
        <SubmitButtonHookForm
          errorField="calldata"
          buttonStyleVersion="default"
        >
          Decode
        </SubmitButtonHookForm>
      </FormStyled>

      {formMethods.formState.isSubmitting && <PageLoader />}

      {result && (
        <CalldataDecoderResult
          {...result}
          decoderContext={decoderContext}
          key={result.calldata}
        />
      )}
    </FormProvider>
  );
};
