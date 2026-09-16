import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateBytes32 } from 'utils/validate-bytes32';
import { Fieldset } from '../style';

export const MarketIdField = ({ fieldName }: { fieldName: string }) => (
  <Fieldset>
    <InputHookForm
      fieldName={fieldName}
      label="Market ID (bytes32)"
      rules={{
        required: 'Field is required',
        validate: (value: string) => validateBytes32(value) ?? true,
      }}
    />
  </Fieldset>
);
