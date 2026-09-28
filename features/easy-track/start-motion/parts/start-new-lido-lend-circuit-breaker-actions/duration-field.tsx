import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { CircuitBreaker } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { validateUintValue } from '@easy-track/utils/validate-uint-value';
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
  const circuitBreaker = useReadContract(CircuitBreaker);

  const { data: bounds } = useQuery<Bounds | null>({
    queryKey: ['ll-circuit-breaker-bounds', circuitBreaker.address, minName],
    staleTime: Infinity,
    queryFn: async () => {
      const [min, max] = await Promise.all([
        circuitBreaker.readContract(minName),
        circuitBreaker.readContract(maxName),
      ]);

      return min === null || max === null ? null : { min, max };
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
            validateUintValue(value, bounds ?? {}) ?? true,
        }}
      />
    </Fieldset>
  );
};
