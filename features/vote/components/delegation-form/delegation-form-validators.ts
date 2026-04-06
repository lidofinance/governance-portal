import invariant from 'tiny-invariant';
import type { Resolver } from 'react-hook-form';

import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation-error';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import {
  DelegationFormInput,
  DelegationFormMode,
  DelegationFormValidationContext,
} from '@vote/types';
import { Address, isAddress } from 'viem';

const VALIDATION_CONTEXT_TIMEOUT = 10000;

// asserts only work with function declaration
// eslint-disable-next-line func-style
function validateAddress(
  field: string,
  value: Address | null,
): asserts value is Address {
  if (value === null) {
    throw new ValidationError(field, 'Address is required');
  }

  if (value.length === 0 || value.length > 42 || !isAddress(value)) {
    throw new ValidationError(field, 'Invalid address');
  }
}

const validateDelegateAddress = (
  field: string,
  value: Address,
  walletAddress: string,
  aragonDelegateAddress: string | null | undefined,
  snapshotDelegateAddress: string | null | undefined,
  mode: DelegationFormMode,
) => {
  const loweredValue = value.toLowerCase();
  if (walletAddress.toLowerCase() === loweredValue) {
    throw new ValidationError(field, 'You cannot delegate to yourself');
  }

  if (
    mode === 'simple' &&
    loweredValue === aragonDelegateAddress &&
    loweredValue === snapshotDelegateAddress
  ) {
    throw new ValidationError(field, 'You cannot delegate to the same address');
  } else if (mode !== 'simple') {
    const delegate =
      mode === 'Aragon' ? aragonDelegateAddress : snapshotDelegateAddress;
    if (loweredValue === delegate) {
      throw new ValidationError(
        field,
        'You cannot delegate to the same address',
      );
    }
  }
};

export const DelegationFormValidationResolver: Resolver<
  DelegationFormInput,
  DelegationFormValidationContext
> = async (values, validationContext) => {
  const { delegateAddress } = values;
  try {
    invariant(validationContext, 'validation context must be present');
    const { asyncContext } = validationContext;

    const awaitedContext = await awaitWithTimeout(
      asyncContext,
      VALIDATION_CONTEXT_TIMEOUT,
    );

    if (!awaitedContext.isWalletActive) {
      return {
        values,
        errors: { token: 'wallet is not connected' },
      };
    }

    validateAddress('delegateAddress', delegateAddress);

    validateDelegateAddress(
      'delegateAddress',
      delegateAddress,
      awaitedContext.walletAddress,
      awaitedContext.aragonDelegateAddress,
      awaitedContext.snapshotDelegateAddress,
      awaitedContext.mode,
    );

    return {
      values,
      errors: {},
    };
  } catch (error) {
    return handleResolverValidationError(error, 'SupportForm', 'token');
  }
};
