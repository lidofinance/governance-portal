import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  MouseEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { formatUnits, maxUint256, parseUnits } from 'viem';
import { Input } from '@lidofinance/lido-ui';

import { InputDecoratorMaxButton } from './input-decorator-max-button';
import { InputDecoratorLocked } from './input-decorator-locked';
import { InputStyled } from './styles';
import { ETH_DECIMALS } from 'shared/blockchain/constants';

const parseUnitsSafe = (value: string, decimals: number) => {
  try {
    const parsed = parseUnits(value, decimals);
    if (parsed === 0n && value.length > 2 + decimals) {
      // 2 + decimals accounts for '0.' and decimals
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

type Props = {
  onChange?: (value: bigint | null) => void;
  value?: bigint | null;
  onMaxClick?: (event: MouseEvent<HTMLButtonElement>, maxValue: bigint) => void;
  maxValue?: bigint;
  isLocked?: boolean;
  // Temp prop to apply different styles, TODO: integrate with design system and remove
  dgStyle?: boolean;
  showMaxButton?: boolean;
  decimals?: number;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;

export const InputAmount = forwardRef<HTMLInputElement, Props>(
  (
    {
      onChange,
      value,
      onMaxClick,
      rightDecorator,
      isLocked,
      maxValue,
      placeholder = '0',
      dgStyle = true,
      showMaxButton = true,
      decimals = ETH_DECIMALS,
      ...props
    },
    ref,
  ) => {
    const defaultValue = useMemo(
      () => (value ? formatUnits(value, decimals) : ''),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const lastInputValue = useRef(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        // will accumulate changes without committing to dom
        let currentValue = e.currentTarget.value;
        const immutableValue = e.currentTarget.value;
        const caretPosition = e.currentTarget.selectionStart ?? 0;

        currentValue = currentValue.trim();

        // Support for devices where inputMode="decimal" showing keyboard with comma as decimal delimiter
        if (currentValue.includes(',')) {
          currentValue = currentValue.replaceAll(',', '.');
        }

        // delete negative sign
        if (currentValue.includes('-')) {
          currentValue = currentValue.replaceAll('-', '');
        }

        // Prepend zero when user types just a dot symbol for "0."
        if (currentValue === '.') {
          currentValue = '0.';
        }

        if (currentValue === '') {
          onChange?.(null);
        } else {
          const value = parseUnitsSafe(currentValue, decimals);
          // invalid value, so we rollback to last valid value
          if (value === null) {
            const rollbackCaretPosition =
              caretPosition -
              Math.min(
                e.currentTarget.value.length - lastInputValue.current.length,
              );
            // rollback value (caret moves to end)
            e.currentTarget.value = lastInputValue.current;
            // rollback caret
            e.currentTarget.setSelectionRange(
              rollbackCaretPosition,
              rollbackCaretPosition,
            );
            return;
          }

          const cappedValue = value > maxUint256 ? maxUint256 : value;
          if (value > maxUint256) {
            currentValue = formatUnits(maxUint256, decimals);
          }
          onChange?.(cappedValue);
        }

        // commit change to dom
        e.currentTarget.value = currentValue;
        // if there is a diff due to soft change, adjust caret to remain in same place
        if (currentValue != immutableValue) {
          const rollbackCaretPosition =
            caretPosition -
            Math.min(immutableValue.length - currentValue.length);
          e.currentTarget.setSelectionRange(
            rollbackCaretPosition,
            rollbackCaretPosition,
          );
        }
        lastInputValue.current = currentValue;
      },
      [onChange, decimals],
    );

    // No dependency array bc the DOM value can be overwritten from outside without
    // a `value` change (react-hook-form writes raw values via the input ref),
    // so the string is re-checked on every render.
    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      if (value === null || value === undefined) {
        input.value = '';
      } else {
        const parsedValue = parseUnitsSafe(input.value, decimals);
        // only change string state if casted values differ
        // this allows user to enter 0.100 without immediate change to 0.1
        if (parsedValue === null || parsedValue !== value) {
          input.value = formatUnits(value, decimals);
          // prevents rollback to incorrect value in onChange
          lastInputValue.current = input.value;
        }
      }
    });

    const handleClickMax =
      onChange && maxValue && maxValue > 0n
        ? (event: MouseEvent<HTMLButtonElement>) => {
            onChange(maxValue);
            onMaxClick?.(event, maxValue);
          }
        : undefined;

    const Component = (dgStyle ? InputStyled : Input) as typeof Input;

    return (
      <Component
        {...props}
        placeholder={placeholder}
        rightDecorator={
          rightDecorator ?? (
            <>
              {showMaxButton ? (
                <InputDecoratorMaxButton
                  onClick={handleClickMax}
                  disabled={!handleClickMax || props.disabled}
                />
              ) : null}
              {isLocked ? <InputDecoratorLocked /> : null}
            </>
          )
        }
        inputMode="decimal"
        defaultValue={defaultValue}
        onChange={handleChange}
        ref={inputRef}
      />
    );
  },
);
