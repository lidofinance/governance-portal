import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { circuitBreakerAbi } from 'abi/generated';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { validateInteger } from '@easy-track/lido-lend/validation';
import { FACTORY_CONTRACTS } from '../../../factories-metadata';
import { Fieldset } from '../style';

type Bounds = { min: bigint; max: bigint };

type BoundsNames =
  | { minName: 'MIN_PAUSE_DURATION'; maxName: 'MAX_PAUSE_DURATION' }
  | { minName: 'MIN_HEARTBEAT_INTERVAL'; maxName: 'MAX_HEARTBEAT_INTERVAL' };

export const DurationField = ({
  fieldName,
  label,
  minName,
  maxName,
}: {
  fieldName: string;
  label: string;
} & BoundsNames) => {
  const { trigger } = useFormContext();
  const factory = useReadContract(
    FACTORY_CONTRACTS.LidoLendCircuitBreakerActions,
  );
  const getCircuitBreakerReader = useReadContractGetter(circuitBreakerAbi);

  // The bounds belong to the breaker the factory checks against, which is not
  // the protocol CircuitBreaker in contract-addresses.ts.
  const { data: bounds } = useQuery<Bounds>({
    queryKey: ['ll-circuit-breaker-bounds', factory.address, minName],
    staleTime: Infinity,
    queryFn: async () => {
      const circuitBreaker = await factory.readContract('circuitBreaker');
      if (circuitBreaker === null) {
        throw new Error('Failed to read LidoLendCircuitBreakerActions data');
      }

      const readCircuitBreaker = getCircuitBreakerReader(circuitBreaker);
      const [min, max] = await Promise.all([
        readCircuitBreaker(minName),
        readCircuitBreaker(maxName),
      ]);

      if (min === null || max === null) {
        throw new Error('Failed to read circuit breaker bounds');
      }

      return { min, max };
    },
  });

  // Bounds arriving after the user typed do not re-run the rule on their own.
  useEffect(() => {
    if (bounds) {
      void trigger(fieldName);
    }
  }, [bounds, fieldName, trigger]);

  return (
    <Fieldset>
      <InputNumberHookForm
        fieldName={fieldName}
        label={
          bounds
            ? `${label} (${bounds.min}–${bounds.max} seconds)`
            : `${label} (seconds)`
        }
        rules={{
          required: 'Field is required',
          validate: (value: string) =>
            validateInteger(value, bounds?.max) ??
            (!bounds ||
              BigInt(value) >= bounds.min ||
              `Value must be at least ${bounds.min}`),
        }}
      />
    </Fieldset>
  );
};
