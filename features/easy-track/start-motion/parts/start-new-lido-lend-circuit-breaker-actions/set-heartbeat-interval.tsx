import { encodeFunctionResult } from 'viem';
import { lidoLendCircuitBreakerActionsAbi as abi } from 'abi/generated';
import type { FormData } from './index';
import type { FieldNames } from '../create-motion-form-part';
import { DurationField } from './duration-field';

export const SetHeartbeatIntervalFields = ({
  fieldNames,
}: {
  fieldNames: FieldNames<FormData, 'newHeartbeatInterval'>;
}) => (
  <DurationField
    fieldName={fieldNames.newHeartbeatInterval}
    label="New heartbeat interval"
    minName="MIN_HEARTBEAT_INTERVAL"
    maxName="MAX_HEARTBEAT_INTERVAL"
  />
);

export const encodeSetHeartbeatInterval = (formData: FormData) =>
  encodeFunctionResult({
    abi,
    functionName: 'decodeConfigValuePayload',
    result: BigInt(formData.newHeartbeatInterval),
  });
