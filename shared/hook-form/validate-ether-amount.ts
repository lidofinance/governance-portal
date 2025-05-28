import { maxUint256 } from 'viem';
import { ValidationError } from './validation-error';
import { Token } from 'shared/blockchain/types';

// asserts only work with function declaration
// eslint-disable-next-line func-style
export function validateEtherAmount(
  field: string,
  amount: bigint | null,
  token: Token,
): asserts amount is bigint {
  if (amount === null) throw new ValidationError(field, '');

  if (amount <= 0n)
    throw new ValidationError(field, `Enter ${token} ${field} greater than 0`);

  if (amount > maxUint256)
    throw new ValidationError(field, `${token} ${field} is not valid`);
}
