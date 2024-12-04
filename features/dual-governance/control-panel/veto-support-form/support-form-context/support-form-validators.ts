import invariant from 'tiny-invariant';
import type { Resolver } from 'react-hook-form';

import { validateEtherAmount } from 'shared/hook-form/validate-ether-amount';
import { handleResolverValidationError } from 'shared/hook-form/validation-error';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import { formatEther } from 'viem';
import { Token } from 'shared/blockchain/types';
import { SupportFormInputType } from './support-form-context';
import { SupportFormValidationContext } from './types';
import { validateBigintMax } from 'shared/hook-form/validate-bigint-max';

// time that validation function waits for context data to resolve
// should be enough to load token balances/tvl/max&min amounts and other contract data
export const VALIDATION_CONTEXT_TIMEOUT = 8000;

const messageMaxAmount = (max: bigint, token: Token) =>
  `Entered ${token} amount exceeds your available balance of ${formatEther(max)}`;

export const SupportFormValidationResolver: Resolver<
  SupportFormInputType,
  SupportFormValidationContext
> = async (values, validationContext) => {
  const { amount, token } = values;
  try {
    invariant(validationContext, 'validation context must be present');
    const { asyncContext } = validationContext;

    validateEtherAmount('amount', amount, token);

    const awaitedContext = await awaitWithTimeout(
      asyncContext,
      VALIDATION_CONTEXT_TIMEOUT,
    );

    if (awaitedContext.isWalletActive) {
      const balance =
        token === Token.stETH
          ? awaitedContext.stEthBalance
          : awaitedContext.wstEthBalance;
      validateBigintMax(
        'amount',
        amount,
        balance,
        messageMaxAmount(balance, token),
      );
    } else {
      return {
        values,
        errors: { token: 'wallet is not connected' },
      };
    }

    return {
      values,
      errors: {},
    };
  } catch (error) {
    return handleResolverValidationError(error, 'SupportForm', 'token');
  }
};
