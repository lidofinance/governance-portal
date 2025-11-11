import { formatBalance } from 'utils/format-balance';
import { DecodeFunctionResultReturnType } from 'viem';
import { limitCheckerAbi } from 'abi/generated/LimitChecker';

export type PeriodDataType = {
  alreadySpentAmount: string;
  spendableBalanceInPeriod: string;
  periodStartTimestamp: number;
  periodEndTimestamp: number;
};

type GetPeriodState = DecodeFunctionResultReturnType<
  typeof limitCheckerAbi,
  'getPeriodState'
>;

export const getPeriodData = async <
  T extends {
    readContract: (functionName: string, ...args: any[]) => Promise<any>;
  },
>(
  contract: T,
): Promise<PeriodDataType> => {
  const [
    alreadySpentAmount,
    spendableBalanceInPeriod,
    periodStartTimestamp,
    periodEndTimestamp,
  ] = (await contract.readContract('getPeriodState')) as GetPeriodState;

  return {
    alreadySpentAmount: formatBalance(alreadySpentAmount),
    spendableBalanceInPeriod: formatBalance(spendableBalanceInPeriod),
    periodStartTimestamp: +periodStartTimestamp,
    periodEndTimestamp: +periodEndTimestamp,
  };
};
