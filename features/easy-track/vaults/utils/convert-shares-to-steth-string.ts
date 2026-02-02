import { BigNumber, utils } from 'ethers';
import { formatVaultParam } from './format-vault-param';

const ONE_ETHER = utils.parseEther('1');

export const convertSharesToStethString = (
  sharesAmount: BigNumber,
  shareRate: BigNumber | undefined,
): string => {
  const stEthAmount = sharesAmount.mul(shareRate ?? 0).div(ONE_ETHER);

  if (stEthAmount.isZero()) {
    return '';
  }

  return ` (~${formatVaultParam(stEthAmount)} stETH)`;
};
