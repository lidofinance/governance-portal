import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  encodeAbiParameters,
  formatUnits,
  getAbiItem,
  type Address,
} from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MAX_FEE, WAD } from '@easy-track/lido-lend/constants';
import {
  DEFAULT_ADDRESS_RULES,
  parsePercentInput,
  validateFeePercent,
  validatePercentValue,
} from '@easy-track/lido-lend/validation';
import { MotionType } from '../../motion-types';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { ErrorBox, Fieldset, MessageBox } from './style';
import { lidoLendActivateMarketAbi } from 'abi/generated';

export type FormData = {
  loanToken: Address;
  collateralToken: Address;
  oracle: Address;
  irm: Address;
  lltv: string;
  irmConfig: Address;
  controller: Address;
  enableSettlement: boolean;
  steward: Address;
  pauserCommittee: Address;
  preseedVault: Address;
  fee: string;
};

export const encodeActivateMarketCallData = ({
  loanToken,
  collateralToken,
  oracle,
  irm,
  lltv,
  fee,
  ...rest
}: FormData) =>
  encodeAbiParameters(
    getAbiItem({
      abi: lidoLendActivateMarketAbi,
      name: 'decodeEVMScriptCallData',
    }).outputs,
    [
      {
        marketParams: {
          loanToken,
          collateralToken,
          oracle,
          irm,
          lltv: parsePercentInput(lltv),
        },
        ...rest,
        fee: parsePercentInput(fee),
      },
    ],
  );

export const formParts = createMotionFormPart({
  motionType: MotionType.LidoLendActivateMarket,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const encodedCallData = encodeActivateMarketCallData(formData);

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    loanToken: '' as Address,
    collateralToken: '' as Address,
    oracle: '' as Address,
    irm: '' as Address,
    lltv: '',
    irmConfig: '' as Address,
    controller: '' as Address,
    enableSettlement: false,
    steward: '' as Address,
    pauserCommittee: '' as Address,
    preseedVault: '' as Address,
    fee: '0',
  }),
  Component: ({ fieldNames, submitAction, factory }) => {
    const { chainId } = useLidoSDK();
    const { setValue } = useFormContext();
    const factoryContract = useReadContract(factory);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(factory);

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: [
        'lido-lend-activate-market-factory-data',
        chainId,
        factoryContract.address,
      ],
      enabled: !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const irmRouter = await factoryContract.readContract('irmRouter');

        if (irmRouter === null) {
          throw new Error('Failed to read LidoLendActivateMarket factory data');
        }

        return { irmRouter };
      },
    });

    // The factory requires marketParams.irm == irmRouter, so mirror the only
    // accepted value into the form instead of asking for it.
    useEffect(() => {
      setValue(fieldNames.irm, factoryData?.irmRouter ?? '');
    }, [factoryData, setValue, fieldNames.irm]);

    if (isFactoryDataLoading || isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (factoryDataError || !factoryData) {
      return (
        <ErrorBox>
          {factoryDataError instanceof Error
            ? factoryDataError.message
            : 'Failed to load LidoLendActivateMarket factory data'}
        </ErrorBox>
      );
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        <MessageBox>
          IrmRouter: <b>{factoryData.irmRouter}</b>
          <br />
          Maximum fee: <b>{formatUnits(MAX_FEE, 16)}%</b> of accrued interest
        </MessageBox>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.loanToken}
            label="Loan token"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.collateralToken}
            label="Collateral token"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.oracle}
            label="Oracle"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.irmConfig}
            label="IRM config"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.controller}
            label="Market controller"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.steward}
            label="Risk steward"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.pauserCommittee}
            label="Pauser committee"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.preseedVault}
            label="Preseed vault (ERC4626)"
            rules={DEFAULT_ADDRESS_RULES}
          />
        </Fieldset>

        <Fieldset>
          <InputNumberHookForm
            fieldName={fieldNames.lltv}
            label="LLTV (%)"
            rules={{
              required: 'Field is required',
              validate: (value: string) =>
                validatePercentValue(value) ??
                (parsePercentInput(value) < WAD || 'LLTV must be below 100%'),
            }}
          />
        </Fieldset>

        <Fieldset>
          <InputNumberHookForm
            fieldName={fieldNames.fee}
            label="Fee (% of accrued interest, 0 skips setFee)"
            rules={{
              required: 'Field is required',
              validate: (value: string) => validateFeePercent(value) ?? true,
            }}
          />
        </Fieldset>

        <Fieldset>
          <CheckboxHookForm
            fieldName={fieldNames.enableSettlement}
            label="Enable settlement"
          />
        </Fieldset>

        {submitAction}
      </>
    );
  },
});
