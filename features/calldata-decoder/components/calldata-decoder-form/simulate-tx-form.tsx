import { Text } from '@lidofinance/lido-ui';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Address, createPublicClient, getAddress, Hex, http } from 'viem';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { SubmitButtonHookForm } from 'shared/hook-form/submit-button-hook-form';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { useLidoSDK } from 'providers/lido-sdk';
import { validateUintValue } from 'utils/validate-uint-value';
import { BlockStyled } from './style';
import { validateAddress } from 'utils/validate-address';

type FormValues = {
  to: string;
  from: string;
  value: string;
};

type Props = {
  calldata: Hex;
  defaultTo?: Address;
};

export const SimulateTxForm = ({ calldata, defaultTo }: Props) => {
  const { chainId } = useLidoSDK();
  const getRpcUrlByChainId = useGetRpcUrlByChainId();

  const [result, setResult] = useState<
    | { type: 'success'; data: Hex | undefined }
    | { type: 'error'; message: string }
    | null
  >(null);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      to: defaultTo ?? '',
      from: '',
      value: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    formMethods.reset({ to: defaultTo ?? '' }, { keepDirtyValues: true });
    setResult(null);
  }, [defaultTo, formMethods]);

  // Use a dedicated client to bypass the project-wide transport wrapper
  // that swallows eth_call reverts (see utils/use-web3-transport.ts).
  const rpcClient = useMemo(() => {
    return createPublicClient({
      transport: http(getRpcUrlByChainId(chainId)),
    });
  }, [chainId, getRpcUrlByChainId]);

  const onSubmit = async ({ to, from, value }: FormValues) => {
    setResult(null);

    const trimmedTo = to.trim();
    const trimmedFrom = from?.trim();
    const trimmedValue = value?.trim();

    try {
      const { data } = await rpcClient.call({
        to: getAddress(trimmedTo),
        account: trimmedFrom ? getAddress(trimmedFrom) : undefined,
        data: calldata,
        value: trimmedValue ? BigInt(trimmedValue) : 0n,
      });

      setResult({ type: 'success', data });
    } catch (error) {
      console.error('[calldata-decoder] simulation failed', error);
      const message =
        error instanceof Error ? error.message : 'Simulation failed';
      setResult({ type: 'error', message });
    }
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <BlockStyled>
            <Text size="sm">Simulate transaction</Text>
            <InputHookForm
              fieldName="to"
              label="to"
              placeholder="0x..."
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  const addressErr = validateAddress(value);
                  if (addressErr) {
                    return addressErr;
                  }
                  return true;
                },
              }}
            />
            <InputHookForm
              fieldName="from"
              label="from (optional)"
              placeholder="0x..."
              rules={{
                validate: (value: string) => {
                  const trimmed = value?.trim();
                  if (!trimmed) {
                    return true;
                  }

                  const addressErr = validateAddress(value);
                  if (addressErr) {
                    return addressErr;
                  }

                  return true;
                },
              }}
            />
            <InputNumberHookForm
              fieldName="value"
              label="value in wei (optional)"
              placeholder="0"
              rules={{
                validate: (value: string) => {
                  const trimmed = value?.trim();
                  if (!trimmed) {
                    return true;
                  }

                  const uintError = validateUintValue(value);
                  if (uintError) {
                    return uintError;
                  }

                  return true;
                },
              }}
            />
            <SubmitButtonHookForm buttonStyleVersion="default">
              Simulate
            </SubmitButtonHookForm>
          </BlockStyled>
        </form>
      </FormProvider>

      {result?.type === 'success' && (
        <BlockStyled>
          <Text size="sm">
            Simulation succeeded
            {result.data && result.data !== '0x'
              ? `. Output: ${result.data}`
              : ''}
          </Text>
        </BlockStyled>
      )}

      {result?.type === 'error' && (
        <BlockStyled>
          <Text size="sm">Simulation failed</Text>
          <Text size="xxs">{result.message}</Text>
        </BlockStyled>
      )}
    </>
  );
};
