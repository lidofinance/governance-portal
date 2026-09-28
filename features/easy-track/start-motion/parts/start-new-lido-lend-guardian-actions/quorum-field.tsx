import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { Fieldset } from '../style';

export const QuorumField = ({ fieldName }: { fieldName: string }) => (
  <Fieldset>
    <InputNumberHookForm
      fieldName={fieldName}
      label="New guardians quorum"
      rules={{
        required: 'Field is required',
        validate: (value: string) =>
          validateInteger(value) ??
          (BigInt(value) > 0n || 'Quorum must be greater than zero'),
      }}
    />
  </Fieldset>
);
