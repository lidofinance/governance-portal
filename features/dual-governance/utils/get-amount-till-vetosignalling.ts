import { DualGovernanceConfig, DualGovernanceDetailedState } from '../types';
import { formatNumber, parsePercent16 } from 'shared/blockchain/utils';
import { formatEther } from 'viem';

export const getAmountUntilVetoSignalling = (
  stateDetails: DualGovernanceDetailedState,
  dgConfigDetails: DualGovernanceConfig,
  stEthTotalSupply: bigint,
) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const { persistedStateEnteredAt } = stateDetails;
  const {
    firstSealRageQuitSupport,
    secondSealRageQuitSupport,
    vetoSignallingMinDuration,
    vetoSignallingMaxDuration,
  } = dgConfigDetails;

  const timestampDiff =
    currentTimestamp - persistedStateEnteredAt - vetoSignallingMinDuration;

  if (timestampDiff < 0) {
    // edge case
    return null;
  }

  // We use this timestamp to add a hardcoded gap of 3 hours to the approximate VetoSignalling restart date
  const futureTimestamp = currentTimestamp + 3 * 3600;

  const firstThreshold = parsePercent16(firstSealRageQuitSupport);
  const secondThreshold = parsePercent16(secondSealRageQuitSupport);

  const thresholdDiff = secondThreshold - firstThreshold;
  const durationDiff = vetoSignallingMaxDuration - vetoSignallingMinDuration;

  const totalSupplyPercentage =
    (thresholdDiff *
      (currentTimestamp + futureTimestamp + persistedStateEnteredAt)) /
    durationDiff;

  if (totalSupplyPercentage > secondThreshold || totalSupplyPercentage < 0) {
    // edge case
    return null;
  }

  const formattedValue = formatNumber({
    value: formatEther(
      (stEthTotalSupply * BigInt(totalSupplyPercentage)) / 100n,
    ),
  });
  const formattedPercentage = formatNumber({ value: totalSupplyPercentage });

  return {
    percentage: formattedPercentage,
    value: formattedValue,
  };
};
