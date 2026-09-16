import { encodeFunctionResult, maxUint128, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { MarketIdField } from './market-id-field';
import { MAX_DELAY_DURATION } from '@easy-track/lido-lend/constants';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { Fieldset, FieldsWrapper, FieldsHeader } from '../style';

export const SetCollateralActivationConfigFields = ({
  fieldNames,
}: {
  fieldNames: {
    marketId: string;
    collateralActivationConfig: string;
  };
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <FieldsWrapper>
      <FieldsHeader>Collateral activation config</FieldsHeader>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.minActivationDelay`}
          label="Min activation delay (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ??
              (BigInt(value) > 0n || 'Value must be greater than zero'),
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.maxActivationDelay`}
          label="Max activation delay (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.maxDelayInflow`}
          label="Max delay inflow"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, maxUint128) ??
              (BigInt(value) > 0n || 'Value must be greater than zero'),
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.minDepositAmount`}
          label="Min deposit amount"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, maxUint128) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.activatingLockDuration`}
          label="Activating lock duration (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.minActivationAmount`}
          label="Min activation amount"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, maxUint128) ??
              (BigInt(value) > 0n || 'Value must be greater than zero'),
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.maxGuardiansQuorumDelay`}
          label="Max guardians quorum delay (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.delayPerStrike`}
          label="Delay per strike (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.collateralActivationConfig}.delayPerSuspect`}
          label="Delay per suspect (s)"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, MAX_DELAY_DURATION) ?? true,
          }}
        />
      </Fieldset>
    </FieldsWrapper>
  </>
);

export const encodeSetCollateralActivationConfig = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetCollateralActivationConfigPayload',
    result: [
      formData.marketId as Hex,
      {
        minActivationDelay: Number(
          formData.collateralActivationConfig.minActivationDelay,
        ),
        maxActivationDelay: Number(
          formData.collateralActivationConfig.maxActivationDelay,
        ),
        maxDelayInflow: BigInt(
          formData.collateralActivationConfig.maxDelayInflow,
        ),
        minDepositAmount: BigInt(
          formData.collateralActivationConfig.minDepositAmount,
        ),
        activatingLockDuration: Number(
          formData.collateralActivationConfig.activatingLockDuration,
        ),
        minActivationAmount: BigInt(
          formData.collateralActivationConfig.minActivationAmount,
        ),
        maxGuardiansQuorumDelay: Number(
          formData.collateralActivationConfig.maxGuardiansQuorumDelay,
        ),
        delayPerStrike: Number(
          formData.collateralActivationConfig.delayPerStrike,
        ),
        delayPerSuspect: Number(
          formData.collateralActivationConfig.delayPerSuspect,
        ),
      },
    ],
  });
