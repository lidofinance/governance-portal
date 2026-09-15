import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { encodeAbiParameters, formatUnits, type Address } from 'viem';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { CheckboxHookForm } from 'shared/hook-form/checkbox-hook-form';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { validateAddress } from 'utils/validate-address';
import {
  ACTIVATION_PARAMS,
  MAX_FEE,
  parsePercentInput,
  validateFeePercent,
  validatePercentValue,
  WAD,
} from '@easy-track/lido-lend/constants';
import { MotionType } from '../../motion-types';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { ErrorBox, Fieldset, MessageBox } from './style';

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

const ADDRESS_FIELDS: readonly {
  readonly name: keyof FormData;
  readonly label: string;
}[] = [
  { name: 'loanToken', label: 'Loan token' },
  { name: 'collateralToken', label: 'Collateral token' },
  { name: 'oracle', label: 'Oracle' },
  { name: 'irmConfig', label: 'IRM config' },
  { name: 'controller', label: 'Market controller' },
  { name: 'steward', label: 'Risk steward' },
  { name: 'pauserCommittee', label: 'Pauser committee' },
  { name: 'preseedVault', label: 'Preseed vault (ERC4626)' },
];

const validateLltv = (value: string) =>
  validatePercentValue(value) ??
  (parsePercentInput(value) < WAD || 'LLTV must be below 100%');

export const encodeActivateMarketCallData = (formData: FormData) =>
  encodeAbiParameters(ACTIVATION_PARAMS, [
    {
      marketParams: {
        loanToken: formData.loanToken,
        collateralToken: formData.collateralToken,
        oracle: formData.oracle,
        irm: formData.irm,
        lltv: parsePercentInput(formData.lltv),
      },
      irmConfig: formData.irmConfig,
      controller: formData.controller,
      enableSettlement: formData.enableSettlement,
      steward: formData.steward,
      pauserCommittee: formData.pauserCommittee,
      preseedVault: formData.preseedVault,
      fee: parsePercentInput(formData.fee),
    },
  ]);

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

        {ADDRESS_FIELDS.map(({ name, label }) => (
          <Fieldset key={name}>
            <InputHookForm
              fieldName={fieldNames[name]}
              label={label}
              rules={{
                required: 'Field is required',
                validate: (value: string) => validateAddress(value) ?? true,
              }}
            />
          </Fieldset>
        ))}

        <Fieldset>
          <InputNumberHookForm
            fieldName={fieldNames.lltv}
            label="LLTV (%)"
            rules={{ required: 'Field is required', validate: validateLltv }}
          />
        </Fieldset>

        <Fieldset>
          <InputNumberHookForm
            fieldName={fieldNames.fee}
            label="Fee (% of accrued interest, 0 skips setFee)"
            rules={{
              required: 'Field is required',
              validate: validateFeePercent,
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
