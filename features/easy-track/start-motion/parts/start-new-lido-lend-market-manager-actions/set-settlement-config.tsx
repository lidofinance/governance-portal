import { encodeFunctionResult, maxUint96, type Hex } from 'viem';
import { lidoLendMarketManagerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { BPS } from '@easy-track/lido-lend/constants';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { Fieldset, FieldsWrapper, FieldsHeader } from '../style';

export const SetSettlementConfigFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'settlementConfig'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <FieldsWrapper>
      <FieldsHeader>Settlement config</FieldsHeader>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.settlementConfig}.sliceFloorBps`}
          label="Slice floor BPS"
          rules={{
            required: 'Field is required',
            validate: (value: string) => validateInteger(value, BPS) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.settlementConfig}.sliceFloorAssets`}
          label="Slice floor assets"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, maxUint96) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.settlementConfig}.fullCutBelowCollateral`}
          label="Full cut below collateral"
          rules={{
            required: 'Field is required',
            validate: (value: string) =>
              validateInteger(value, maxUint96) ?? true,
          }}
        />
      </Fieldset>
      <Fieldset>
        <InputNumberHookForm
          fieldName={`${fieldNames.settlementConfig}.ltvStepBps`}
          label="LTV step BPS"
          rules={{
            required: 'Field is required',
            validate: (value: string) => validateInteger(value, BPS) ?? true,
          }}
        />
      </Fieldset>
    </FieldsWrapper>
  </>
);

export const encodeSetSettlementConfig = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeSetSettlementConfigPayload',
    result: [
      formData.marketId as Hex,
      {
        sliceFloorBps: Number(formData.settlementConfig.sliceFloorBps),
        sliceFloorAssets: BigInt(formData.settlementConfig.sliceFloorAssets),
        fullCutBelowCollateral: BigInt(
          formData.settlementConfig.fullCutBelowCollateral,
        ),
        ltvStepBps: Number(formData.settlementConfig.ltvStepBps),
      },
    ],
  });
