import { useCallback, useRef } from 'react';
import type { ComponentProps } from 'react';
import type { RegisterOptions } from 'react-hook-form';

import { InputHookForm } from './input-hook-form';
import { InputNumberHookForm } from './input-number-hook-form';

const DEFAULT_DEBOUNCE_TIMEOUT_MS = 500;

type Props = Omit<ComponentProps<typeof InputHookForm>, 'rules'> & {
  valueType?: 'string' | 'number';
  debounceTimeoutMs?: number;
  validateSync?: (value: string) => string | null | undefined;
  validateAsync?: (value: string) => Promise<string | null | undefined>;
  rules?: Omit<RegisterOptions, 'validate'>;
};

export const ValidatedInputHookForm = ({
  valueType = 'string',
  debounceTimeoutMs = DEFAULT_DEBOUNCE_TIMEOUT_MS,
  validateSync,
  validateAsync,
  rules,
  ...rest
}: Props) => {
  const Component =
    valueType === 'number' ? InputNumberHookForm : InputHookForm;
  const latestToken = useRef(0);

  const validate = useCallback(
    async (value: string) => {
      // Empty is "valid" here; consumers wire `required` via `rules` if needed.
      if (!value) return true;

      // Sync first — fails fast without waiting on the debounce.
      const syncErr = validateSync?.(value);
      if (syncErr) return syncErr;
      if (!validateAsync) return true;

      // Token guards against stale runs: only the latest call's result is kept.
      const token = ++latestToken.current;
      await new Promise((resolve) => setTimeout(resolve, debounceTimeoutMs));
      if (token !== latestToken.current) return true;

      const asyncErr = await validateAsync(value);
      if (token !== latestToken.current) return true;
      // RHF expects `true` for valid or a string error message.
      return asyncErr ?? true;
    },
    [validateSync, validateAsync, debounceTimeoutMs],
  );

  return (
    <Component {...rest} rules={{ ...rules, validate } as RegisterOptions} />
  );
};
