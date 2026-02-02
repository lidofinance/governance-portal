import { BigNumber } from 'ethers';
import { convertSharesToStethString } from './convert-shares-to-steth-string';
import { formatVaultParam } from './format-vault-param';

// An utility function to render vault tier updates
export const renderVaultParamUpdate = (
  before: BigNumber | number | undefined,
  after: BigNumber,
  isBp: boolean,
  shareRate?: BigNumber,
) => {
  const convertedSharesAfter = isBp
    ? ''
    : convertSharesToStethString(after, shareRate);

  if (before === undefined) {
    return `${formatVaultParam(after, isBp)}${convertedSharesAfter}`;
  }
  if (after.eq(before)) {
    return (
      <>
        {formatVaultParam(after, isBp)}
        {convertedSharesAfter} <b>(no change)</b>
      </>
    );
  }

  return `from ${formatVaultParam(before, isBp)} to ${formatVaultParam(
    after,
    isBp,
  )}${convertedSharesAfter}`;
};
