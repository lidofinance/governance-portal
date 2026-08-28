import { useQuery } from '@tanstack/react-query';
import {
  encodeAbiParameters,
  formatEther,
  parseAbiParameters,
  parseEther,
} from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { validateEtherValue } from 'utils/validate-ether-value';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MotionType } from '../../motion-types';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { ErrorBox, Fieldset, MessageBox } from './style';
import { StETH } from 'shared/blockchain/contracts';

type FormData = {
  newDepositsReserveTarget: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SetDepositsReserveTarget,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const encodedCallData = encodeAbiParameters(parseAbiParameters('uint256'), [
      parseEther(formData.newDepositsReserveTarget),
    ]);

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    newDepositsReserveTarget: '',
  }),
  Component: ({ fieldNames, submitAction, factory }) => {
    const { chainId } = useLidoSDK();

    const factoryContract = useReadContract(factory);
    const stETH = useReadContract(StETH);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(factory);

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: [
        'set-deposits-reserve-target-factory-data',
        chainId,
        factoryContract.address,
      ],
      enabled: !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const [maxDepositsReserveTarget, currentDepositsReserveTarget] =
          await Promise.all([
            factoryContract.readContract('MAX_DEPOSITS_RESERVE_TARGET'),
            stETH.readContract('getDepositsReserveTarget'),
          ]);

        if (
          maxDepositsReserveTarget === null ||
          currentDepositsReserveTarget === null
        ) {
          throw new Error('Failed to read deposits reserve target');
        }

        return { maxDepositsReserveTarget, currentDepositsReserveTarget };
      },
    });

    const validateNewDepositsReserveTarget = (value: string) => {
      const etherError = validateEtherValue(value);
      if (etherError) {
        return etherError;
      }

      if (!factoryData) {
        return true;
      }

      const parsed = parseEther(value);

      if (parsed > factoryData.maxDepositsReserveTarget) {
        return `Value must not exceed ${formatEther(
          factoryData.maxDepositsReserveTarget,
        )} ETH`;
      }

      if (parsed === factoryData.currentDepositsReserveTarget) {
        return 'Value is the same as the current deposits reserve target';
      }

      return true;
    };

    if (isFactoryDataLoading || isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (factoryDataError || !factoryData) {
      return (
        <ErrorBox>
          {factoryDataError instanceof Error
            ? factoryDataError.message
            : 'Failed to load SetDepositsReserveTarget factory data'}
        </ErrorBox>
      );
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        <MessageBox>
          Current deposits reserve target:{' '}
          <b>{formatEther(factoryData.currentDepositsReserveTarget)} ETH</b>
          <br />
          Maximum allowed:{' '}
          <b>{formatEther(factoryData.maxDepositsReserveTarget)} ETH</b>
        </MessageBox>

        <Fieldset>
          <InputNumberHookForm
            fieldName={fieldNames.newDepositsReserveTarget}
            label="New deposits reserve target (ETH)"
            rules={{
              required: 'Field is required',
              validate: validateNewDepositsReserveTarget,
            }}
          />
        </Fieldset>

        {submitAction}
      </>
    );
  },
});
