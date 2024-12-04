import { useLidoSDK } from 'providers/lido-sdk';
import { GetFeeHistoryReturnType } from 'viem';
import { useFeeHistory } from 'wagmi';

const REWARD_PERCENTILES = [25];

const feeHistoryToMaxFee = ({
  reward,
  baseFeePerGas,
}: GetFeeHistoryReturnType) => {
  const maxPriorityFeePerGas = reward
    ? reward?.map((fees) => fees[0]).reduce((sum, fee) => sum + fee) /
      BigInt(reward.length)
    : BigInt(0);

  const lastBaseFeePerGas = baseFeePerGas[0];

  // we have to multiply by 2 until we find a reliable way to predict baseFee change
  const maxFeePerGas = lastBaseFeePerGas * BigInt(2) + maxPriorityFeePerGas;
  return maxFeePerGas;
};

export const useMaxGasPrice = () => {
  const { chainId } = useLidoSDK();

  return useFeeHistory({
    blockCount: 5,
    blockTag: 'pending',
    chainId,
    rewardPercentiles: REWARD_PERCENTILES,
    query: {
      select: feeHistoryToMaxFee,
    },
  });
};
