type Props = {
  targetPercent: number;
  currentSupport: bigint;
  stEthTotalSupply: bigint;
};

export const calculateCurrentThresholdProgress = ({
  targetPercent,
  currentSupport,
  stEthTotalSupply,
}: Props): {
  thresholdSupportPercent: number;
  targetValue: bigint;
} => {
  if (targetPercent < 0 || currentSupport < 0n || stEthTotalSupply < 0n) {
    return { thresholdSupportPercent: 0, targetValue: 0n };
  }

  if (stEthTotalSupply === 0n) {
    const percent = currentSupport > 0n ? 100 : 0;
    return { thresholdSupportPercent: percent, targetValue: 0n };
  }

  const targetValue = (stEthTotalSupply * BigInt(targetPercent)) / 100n;

  if (targetValue === 0n) {
    const percent = currentSupport > 0n ? 100 : 0;
    return { thresholdSupportPercent: percent, targetValue: 0n };
  }

  const thresholdSupportPercentBigInt = (currentSupport * 100n) / targetValue;

  let thresholdSupportPercentNumber = Number(thresholdSupportPercentBigInt);

  if (thresholdSupportPercentNumber > 100) {
    thresholdSupportPercentNumber = 100;
  }
  if (thresholdSupportPercentNumber < 0) {
    thresholdSupportPercentNumber = 0;
  }

  return {
    thresholdSupportPercent: thresholdSupportPercentNumber,
    targetValue: targetValue,
  };
};
