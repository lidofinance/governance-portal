import { formatVaultParam } from './format-vault-param';
import { parseEther } from 'viem';

const ONE_ETHER = parseEther('1');

export const convertSharesToStethString = (
  sharesAmount: bigint,
  shareRate: bigint | undefined,
): string => {
  const stEthAmount = (sharesAmount * (shareRate ?? 0n)) / ONE_ETHER;

  if (stEthAmount === 0n) {
    return '';
  }

  return ` (~${formatVaultParam(stEthAmount)} stETH)`;
};
