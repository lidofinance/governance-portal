import { encodeFunctionResult } from 'viem';
import { lidoLendCircuitBreakerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { DurationField } from './duration-field';

export const SetPauseDurationFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'newPauseDuration'>;
}) => (
  <DurationField
    fieldName={fieldNames.newPauseDuration}
    label="New pause duration"
    minName="MIN_PAUSE_DURATION"
    maxName="MAX_PAUSE_DURATION"
  />
);

export const encodeSetPauseDuration = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeConfigValuePayload',
    result: BigInt(formData.newPauseDuration),
  });
