import { useMemo } from 'react';

/**
 * Hook to calculate the threshold value in stETH based on percentage of total supply
 * @param percentThreshold Percentage threshold (e.g., 5 for 5%)
 * @param stEthTotalSupply Total stETH supply in wei
 * @returns The threshold value in wei, or undefined if inputs are missing
 */
export const useThresholdValue = (
  percentThreshold: number | undefined,
  stEthTotalSupply: bigint | undefined,
) => {
  return useMemo(() => {
    if (!percentThreshold || !stEthTotalSupply) return undefined;

    const decimalThreshold = percentThreshold / 100;

    return BigInt(Math.floor(Number(stEthTotalSupply) * decimalThreshold));
  }, [percentThreshold, stEthTotalSupply]);
};
