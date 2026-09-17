import { encodeFunctionResult, type Hex } from 'viem';
import { lidoLendGuardianActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { MarketIdField } from '@easy-track/lido-lend/market-id-field';
import { QuorumField } from './quorum-field';
import { Fieldset } from '../style';

export const AddGuardianFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'marketId' | 'guardian' | 'newQuorum'>;
}) => (
  <>
    <MarketIdField fieldName={fieldNames.marketId} />
    <Fieldset>
      <InputHookForm
        fieldName={fieldNames.guardian}
        label="Guardian address"
        rules={{
          required: 'Field is required',
          validate: (value: string) => validateAddress(value) ?? true,
        }}
      />
    </Fieldset>
    <QuorumField fieldName={fieldNames.newQuorum} />
  </>
);

export const encodeAddGuardian = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeAddGuardianPayload',
    result: [
      formData.marketId as Hex,
      formData.guardian as Hex,
      BigInt(formData.newQuorum),
    ],
  });
